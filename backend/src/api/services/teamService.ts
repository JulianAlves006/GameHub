import { AppDataSource } from '../../data-source.ts';
import { Gamer } from '../entities/Gamer.ts';
import { Team } from '../entities/Team.ts';
import { User } from '../entities/User.ts';

const teamRepository = AppDataSource.getRepository(Team);

export async function getTeamLogo(id: number) {
  // Se você marcou logo com select:false, o addSelect é obrigatório
  const team = await teamRepository
    .createQueryBuilder('team')
    .addSelect('team.logo')
    .where('team.id = :id', { id })
    .getOne();

  if (!team) throw new Error('Time não encontrado');

  if (!team.logo || (team.logo as any).length === 0) {
    throw new Error('Logo não encontrado');
  }

  return team;
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

export async function createTeam(name: string, logo: Buffer, user: number) {
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

  const team = {
    name,
    logo,
    gamer: userData?.gamers[0].id,
  };

  const newTeam = await teamRepository.save(teamRepository.create(team));
  const newGamer = {
    team: newTeam.id,
  };
  await AppDataSource.getRepository(Gamer)
    .createQueryBuilder()
    .update(Gamer)
    .set(newGamer)
    .where('id = :id', { id: userData?.gamers?.[0]?.id })
    .execute();
  return newTeam;
}

export async function updateTeam(
  body: Team,
  logo: Buffer,
  user: { id: number; role: string }
) {
  const { id, name } = body;
  if (!id || !name) throw new Error('Informações obrigatórias faltando!');

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

  if (!logo) {
    const newTeam = {
      name,
    };
    teamRepository
      .createQueryBuilder()
      .update(Team)
      .set(newTeam)
      .where('id = :id', { id: id })
      .execute();
    return 'Time atualizado com sucesso!';
  }

  const newTeam = {
    name,
    logo,
  };
  teamRepository
    .createQueryBuilder()
    .update(Team)
    .set(newTeam)
    .where('id = :id', { id: id })
    .execute();
  return 'Time atualizado com sucesso!';
}
