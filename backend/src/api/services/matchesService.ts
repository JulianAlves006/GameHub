import { AppDataSource } from '../../data-source.ts';
import { Match } from '../entities/Match.ts';
import { Team } from '../entities/Team.ts';
import { Championship } from '../entities/Championship.ts';

const matchRepository = AppDataSource.getRepository(Match);

export async function getMatches(
  page: number = 1,
  limit: number = 10,
  idChampionship: number,
  idMatch: number,
  idTeam: number
) {
  if (idChampionship && !idMatch) {
    const skip = (page - 1) * limit;
    const matches = await AppDataSource.getRepository(Match).find({
      relations: {
        championship: {
          awardsChampionships: { award: true, championship: true },
          admin: true,
        },
        team1: { gamers: { user: true } },
        team2: { gamers: { user: true } },
        winner: true,
        metrics: { gamer: { user: true } },
      },
      skip,
      take: limit,
      where: {
        championship: { id: idChampionship },
      },
    });
    return matches;
  }
  if (idMatch && !idChampionship) {
    const skip = (page - 1) * limit;
    const matches = await AppDataSource.getRepository(Match).find({
      relations: {
        championship: {
          awardsChampionships: { award: true, championship: true },
          admin: true,
        },
        team1: { gamers: { user: true } },
        team2: { gamers: { user: true } },
        winner: true,
        metrics: { gamer: { user: true } },
      },
      skip,
      take: limit,
      where: {
        id: idMatch,
      },
    });
    return matches;
  }
  if (idMatch && idChampionship) {
    const skip = (page - 1) * limit;
    const matches = await AppDataSource.getRepository(Match).find({
      relations: {
        championship: {
          awardsChampionships: { award: true, championship: true },
          admin: true,
        },
        team1: { gamers: { user: true } },
        team2: { gamers: { user: true } },
        winner: true,
        metrics: { gamer: { user: true } },
      },
      skip,
      take: limit,
      where: {
        championship: { id: idChampionship },
        id: idMatch,
      },
    });
    return matches;
  }
  if (idTeam) {
    const skip = (page - 1) * limit;
    const matches = await AppDataSource.getRepository(Match).find({
      relations: {
        championship: {
          awardsChampionships: { award: true, championship: true },
          admin: true,
        },
        team1: { gamers: { user: true } },
        team2: { gamers: { user: true } },
        winner: true,
        metrics: { gamer: { user: true } },
      },
      skip,
      take: limit,
      where: [{ team1: { id: idTeam } }, { team2: { id: idTeam } }],
    });
    return matches;
  }
  const skip = (page - 1) * limit;
  const matches = await AppDataSource.getRepository(Match).find({
    relations: {
      championship: {
        awardsChampionships: { award: true, championship: true },
      },
      team1: { gamers: { user: true } },
      team2: { gamers: { user: true } },
      winner: true,
      metrics: { gamer: { user: true } },
    },
    skip,
    take: limit,
  });
  return matches;
}

export async function createMatch(
  body: Match,
  user: { id: number; role: string }
) {
  const { team1, team2, winner, championship, status, scoreboard } = body;
  if (user.role !== 'admin') throw new Error('Usuário sem permissão');
  if (!team1 || !team2 || !championship || !status)
    throw new Error('Algumas informações obrigatórias estão faltando!');

  const team1Exist = await AppDataSource.getRepository(Team).findOneBy({
    id: team1,
  });
  if (!team1Exist) throw new Error('Time 1 não encontrado!');
  const team2Exist = await AppDataSource.getRepository(Team).findOneBy({
    id: team2,
  });
  if (!team2Exist) throw new Error('Time 2 não encontrado!');

  const championshipData = await AppDataSource.getRepository(
    Championship
  ).findOne({
    where: { id: championship },
    relations: {
      admin: true,
    },
  });
  if (!championshipData) throw new Error('Campeonato não encontrado.');
  if (championshipData.admin.id !== user.id)
    throw new Error('Este usuário não pode realizar esta ação!');
  const match = {
    team1,
    team2,
    winner,
    championship,
    status,
    scoreboard,
  };
  const newMatch = matchRepository.create(match);
  await matchRepository.save(newMatch);
  return newMatch;
}

export async function updateMatch(
  body: Match,
  user: { id: number; role: string }
) {
  const { id, winner, status, scoreboard } = body;
  if (user.role !== 'admin') throw new Error('Usuário sem permissão');
  if (!id) throw new Error('Id não informado!');

  const match = await matchRepository.findOne({
    where: { id: id },
    relations: {
      championship: true,
    },
  });
  if (!match) throw new Error('Partida não encontrada!');

  const championshipData = await AppDataSource.getRepository(
    Championship
  ).findOne({
    where: { id: match?.championship.id },
    relations: {
      admin: true,
    },
  });
  if (championshipData?.admin.id !== user.id)
    throw new Error('Este usuário não pode realizar esta ação!');

  const newMatch = {
    winner: winner ?? null,
    championship: { id: match?.championship.id },
    status,
    scoreboard,
  };

  await matchRepository
    .createQueryBuilder()
    .update(Match)
    .set(newMatch)
    .where('id = :id', { id })
    .execute();
  return 'Partida editada com sucesso!';
}

export async function deleteMatch(
  id: number,
  user: { id: number; role: string }
) {
  const match = await matchRepository.findOne({
    where: { id: id },
    relations: {
      championship: true,
    },
  });
  if (!match) throw new Error('Partida não encontrada!');
  if (match.status === 'playing')
    throw new Error(
      'A partida está em andamento. Portanto não pode ser excluída!'
    );
  const championshipData = await AppDataSource.getRepository(
    Championship
  ).findOne({
    where: { id: match?.championship.id },
    relations: {
      admin: true,
    },
  });
  if (championshipData?.admin.id !== user.id)
    throw new Error('Este usuário não pode realizar esta ação!');

  await matchRepository
    .createQueryBuilder()
    .delete()
    .from(Match)
    .where('id = :id', { id })
    .execute();
  return `Partida deletada com sucesso`;
}
