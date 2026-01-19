import { AppDataSource } from '../../data-source.ts';
import { Championship, Match, Metric, Team } from '../entities/index.ts';

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
  const team1Id =
    typeof team1 === 'object' && team1 !== null && 'id' in team1
      ? team1.id
      : team1;
  const team2Id =
    typeof team2 === 'object' && team2 !== null && 'id' in team2
      ? team2.id
      : team2;
  const championshipId =
    typeof championship === 'object' &&
    championship !== null &&
    'id' in championship
      ? championship.id
      : championship;
  const team1Exist = await AppDataSource.getRepository(Team).findOneBy({
    id: team1Id,
  });
  if (!team1Exist) throw new Error('Time 1 não encontrado!');
  const team2Exist = await AppDataSource.getRepository(Team).findOneBy({
    id: team2Id,
  });
  if (!team2Exist) throw new Error('Time 2 não encontrado!');

  const championshipData = await AppDataSource.getRepository(
    Championship
  ).findOne({
    where: { id: championshipId },
    relations: {
      admin: true,
    },
  });
  if (!championshipData) throw new Error('Campeonato não encontrado.');
  if (championshipData.admin.id !== user.id)
    throw new Error('Este usuário não pode realizar esta ação!');
  const winnerId =
    typeof winner === 'object' && winner !== null && 'id' in winner
      ? winner.id
      : winner;
  const match: any = {
    team1: { id: team1Id },
    team2: { id: team2Id },
    championship: { id: championshipId },
    status,
    scoreboard,
  };
  if (winnerId) {
    match.winner = { id: winnerId };
  }
  const newMatch = matchRepository.create(match);
  const savedMatch = await matchRepository.save(newMatch);
  const matchId = Array.isArray(savedMatch)
    ? (savedMatch[0] as Match)?.id
    : (savedMatch as Match)?.id;

  return {
    savedMatch: savedMatch as Match | Match[],
    matchId,
    team1Id,
    team2Id,
  };
}

export async function updateMatch(
  body: Match,
  user: { id: number; role: string }
) {
  const { id, winner, status, scoreboard } = body;
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

  // Construir objeto de atualização apenas com campos que foram fornecidos
  const updateData: Partial<Match> = {};

  if (status !== undefined) {
    updateData.status = status;
  }

  if (scoreboard !== undefined) {
    updateData.scoreboard = scoreboard;
  }

  // Tratar winner - se for um objeto, extrair o ID
  if (winner !== undefined) {
    const winnerId =
      typeof winner === 'object' && winner !== null && 'id' in winner
        ? winner.id
        : winner;
    updateData.winner = winnerId ? ({ id: winnerId } as any) : null;
  }

  // Não atualizar championship pois ele não deve mudar e pode causar problemas de foreign key
  // O championship da partida é fixo e não deve ser alterado após a criação

  if (Object.keys(updateData).length > 0) {
    await matchRepository
      .createQueryBuilder()
      .update(Match)
      .set(updateData as any)
      .where('id = :id', { id })
      .execute();
  }

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

  // Verificar se existem métricas relacionadas à partida
  const metricsRepository = AppDataSource.getRepository(Metric);
  const metrics = await metricsRepository.find({
    where: { match: { id } },
  });

  if (metrics.length > 0) {
    throw new Error(
      `Não é possível excluir esta partida pois ela possui ${metrics.length} métrica(s) registrada(s). Por favor, remova as métricas antes de excluir a partida.`
    );
  }

  await matchRepository
    .createQueryBuilder()
    .delete()
    .from(Match)
    .where('id = :id', { id })
    .execute();

  return `Partida deletada com sucesso`;
}
