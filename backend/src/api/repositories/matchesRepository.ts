import { AppDataSource } from '../../data-source.ts';
import { Championship, Match, Metric, Team } from '../entities/index.ts';

const matchRepository = AppDataSource.getRepository(Match);

export async function getMatchesPlayingFinishedCount() {
  const playingCount = await matchRepository.count({
    where: { status: 'playing' },
  });
  const finishedCount = await matchRepository.count({
    where: { status: 'finished' },
  });
  return { playing: playingCount, finished: finishedCount };
}

export async function getMatches(
  page: number = 1,
  limit: number = 10,
  idChampionship: number,
  idMatch: number,
  idTeam: number,
  search: string
) {
  if (search) {
    const skip = (page - 1) * limit;
    const queryBuilder = matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.championship', 'championship')
      .leftJoinAndSelect(
        'championship.awardsChampionships',
        'awardsChampionships'
      )
      .leftJoinAndSelect('awardsChampionships.award', 'award')
      .leftJoinAndSelect(
        'awardsChampionships.championship',
        'awardChampionship'
      )
      .leftJoinAndSelect('championship.admin', 'admin')
      .leftJoinAndSelect('match.team1', 'team1')
      .leftJoinAndSelect('team1.gamers', 'team1Gamers')
      .leftJoinAndSelect('team1Gamers.user', 'team1GamersUser')
      .leftJoinAndSelect('match.team2', 'team2')
      .leftJoinAndSelect('team2.gamers', 'team2Gamers')
      .leftJoinAndSelect('team2Gamers.user', 'team2GamersUser')
      .leftJoinAndSelect('match.winner', 'winner')
      .leftJoinAndSelect('match.metrics', 'metrics')
      .leftJoinAndSelect('metrics.gamer', 'metricsGamer')
      .leftJoinAndSelect('metricsGamer.user', 'metricsGamerUser')
      .where('championship.name LIKE :search', { search: `%${search}%` })
      .orWhere('team1.name LIKE :search', { search: `%${search}%` })
      .orWhere('team2.name LIKE :search', { search: `%${search}%` })
      .skip(skip)
      .take(limit);

    const [matches, count] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      matches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  }
  if (idChampionship && !idMatch) {
    const skip = (page - 1) * limit;
    const [matches, count] = await matchRepository.findAndCount({
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
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      matches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  }
  if (idMatch && !idChampionship) {
    const skip = (page - 1) * limit;
    const [matches, count] = await AppDataSource.getRepository(
      Match
    ).findAndCount({
      relations: {
        championship: {
          awardsChampionships: { award: true, championship: true },
          admin: true,
        },
        team1: { gamers: { user: true, team: true } },
        team2: { gamers: { user: true, team: true } },
        winner: true,
        metrics: { gamer: { user: true, team: true } },
      },
      skip,
      take: limit,
      where: {
        id: idMatch,
      },
    });
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      matches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  }
  if (idMatch && idChampionship) {
    const skip = (page - 1) * limit;
    const [matches, count] = await AppDataSource.getRepository(
      Match
    ).findAndCount({
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
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      matches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  }
  if (idTeam) {
    const skip = (page - 1) * limit;
    const [matches, count] = await AppDataSource.getRepository(
      Match
    ).findAndCount({
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
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      matches,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    };
  }
  const skip = (page - 1) * limit;
  const [matches, count] = await AppDataSource.getRepository(
    Match
  ).findAndCount({
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
  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    matches,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: count,
      hasNextPage,
      hasPreviousPage,
      limit,
    },
  };
}

export async function createMatch(
  body: Match,
  user: { id: number; role: string }
) {
  const {
    team1,
    team2,
    winner,
    championship,
    status,
    scoreTeam1,
    scoreTeam2,
    matchDate,
  } = body;
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
    scoreTeam1: scoreTeam1 ?? null,
    scoreTeam2: scoreTeam2 ?? null,
    matchDate: matchDate ?? null,
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
  const { id, winner, status, scoreTeam1, scoreTeam2, matchDate } = body;
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

  if (scoreTeam1 !== undefined) {
    updateData.scoreTeam1 = scoreTeam1;
  }

  if (scoreTeam2 !== undefined) {
    updateData.scoreTeam2 = scoreTeam2;
  }

  if (matchDate !== undefined) {
    updateData.matchDate = matchDate;
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
