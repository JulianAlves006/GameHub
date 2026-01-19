import { AppDataSource } from '../../data-source.ts';
import { deleteObject, getPresignedUrl, uploadBuffer } from '../../s3.ts';
import { Gamer, Team, User } from '../entities/index.ts';
import { v4 as uuid } from 'uuid';

const teamRepository = AppDataSource.getRepository(Team);
const PREFIX = process.env.S3_PUBLIC_PREFIX || 'uploads/teams/';

export async function getTeamLogo(id: number) {
  const team = await teamRepository.findOne({
    where: { id },
  });

  if (!team) throw new Error('Time não encontrado');

  if (!team.logo || team.logo.trim() === '') {
    throw new Error('Logo não encontrado');
  }

  // Retorna a presigned URL do S3 (válida por 1 hora)
  const logoUrl = await getPresignedUrl(team.logo, 3600);
  return {
    ...team,
    logoUrl,
  };
}

export async function getTeams(
  page: number = 1,
  limit: number = 10,
  id: number,
  idAdmin: number
) {
  const skip = (page - 1) * limit;

  // Primeiro, vamos buscar os times com suas relações
  let teamsQuery = teamRepository
    .createQueryBuilder('team')
    .leftJoinAndSelect('team.gamers', 'gamers')
    .leftJoinAndSelect('team.gamer', 'gamer')
    .leftJoinAndSelect('gamers.user', 'user')
    .leftJoinAndSelect('gamers.metrics', 'gamersMetrics')
    .leftJoinAndSelect('gamer.user', 'gamerUser')
    .leftJoinAndSelect('team.matchesAsTeam1', 'matchesAsTeam1')
    .leftJoinAndSelect('team.matchesAsTeam2', 'matchesAsTeam2')
    .leftJoinAndSelect('team.matchesWon', 'matchesWon');

  // Aplicar filtros
  if (id && !idAdmin) {
    teamsQuery = teamsQuery.where('team.id = :id', { id });
  } else if (idAdmin && !id) {
    teamsQuery = teamsQuery.where('gamer.id = :idAdmin', { idAdmin });
  } else if (id && idAdmin) {
    teamsQuery = teamsQuery.where('team.id = :id AND gamer.id = :idAdmin', {
      id,
      idAdmin,
    });
  }

  // Buscar todos os times
  const allTeams = await teamsQuery.getMany();

  // Calcular score total para cada time e ordenar
  const teamsWithScore = allTeams
    .map(team => {
      const totalScore =
        team.gamers?.reduce((sum, gamer) => sum + (gamer.score || 0), 0) || 0;
      return { ...team, totalScore };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  // Aplicar paginação
  const totalCount = teamsWithScore.length;
  const teams = teamsWithScore.slice(skip, skip + limit);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    teams,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      limit,
    },
  };
}

export async function createTeam(
  name: string,
  logo: Buffer,
  contentType: string,
  user: number
) {
  const userData = await AppDataSource.getRepository(User).findOne({
    where: {
      id: user,
    },
    relations: {
      gamers: true,
    },
  });

  if (!userData || !userData.gamers || userData.gamers.length === 0) {
    throw new Error('Você precisa ser um jogador para poder criar um time');
  }

  if (!name || !logo)
    throw new Error('Todas as informações devem ser preenchidas');

  const exist = await teamRepository.findBy({
    name: name,
  });
  if (exist.length > 0) throw new Error('Nome de time já cadastrado!');

  // Upload para S3
  const now = new Date();
  const ext = contentType.split('/')[1] || 'png';
  const key = `${PREFIX}${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uuid()}.${ext}`;

  await uploadBuffer({
    key,
    buffer: logo,
    contentType,
  });

  const gamer = userData?.gamers?.[0];
  if (!gamer) {
    throw new Error('Gamer não encontrado');
  }

  const team = teamRepository.create({
    name,
    logo: key,
    gamer: gamer,
  });

  const newTeam = await teamRepository.save(team);
  const newGamer = {
    team: newTeam,
  };
  await AppDataSource.getRepository(Gamer)
    .createQueryBuilder()
    .update(Gamer)
    .set(newGamer)
    .where('id = :id', { id: gamer.id })
    .execute();

  return newTeam;
}

export async function updateTeam(
  body: Team,
  logo: Buffer | null,
  contentType: string | null,
  user: { id: number; role: string }
) {
  const { id, name } = body;

  const team = await teamRepository.findOne({
    where: { id },
    relations: {
      gamer: true,
      matchesAsTeam1: true,
      matchesAsTeam2: true,
    },
  });
  const userData = await AppDataSource.getRepository(User).findOne({
    where: { id: user.id },
    relations: {
      gamers: true,
    },
  });
  if (!team) throw new Error('Time não encontrado!');
  if (team?.gamer?.id !== userData?.gamers?.[0]?.id)
    throw new Error('Este usuário não pode realizar esta ação!');
  if (team.matchesAsTeam1.some(match => match.status === 'playing'))
    throw new Error(
      'O time não pode ser editado enquanto está em uma partida!'
    );
  if (team.matchesAsTeam2.some(match => match.status === 'playing'))
    throw new Error(
      'O time não pode ser editado enquanto está em uma partida!'
    );

  let newLogoKey = team.logo;

  if (logo && contentType) {
    // Deletar logo antigo se existir
    if (team.logo) {
      try {
        await deleteObject({ key: team.logo });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao deletar logo antigo:', error);
      }
    }

    // Upload do novo logo para S3
    const now = new Date();
    const ext = contentType.split('/')[1] || 'png';
    const key = `${PREFIX}${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uuid()}.${ext}`;

    await uploadBuffer({
      key,
      buffer: logo,
      contentType,
    });

    newLogoKey = key;
  }

  const newTeam = {
    name,
    logo: newLogoKey,
  };

  await teamRepository
    .createQueryBuilder()
    .update(Team)
    .set(newTeam)
    .where('id = :id', { id: id })
    .execute();

  return { text: 'Time atualizado com sucesso!', id, name };
}
