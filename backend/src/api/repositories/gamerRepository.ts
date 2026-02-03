import { AppDataSource } from '../../data-source.ts';
import { Gamer, Team, Metric } from '../entities/index.ts';

const gamerRepository = AppDataSource.getRepository(Gamer);

export async function getTopGamers() {
  // 1. Jogador com maior score
  const topScorer = await gamerRepository
    .createQueryBuilder('gamer')
    .leftJoinAndSelect('gamer.user', 'user')
    .orderBy('gamer.score', 'DESC')
    .getOne();

  // 2. Jogador com mais gols
  const topGoalScorer = await gamerRepository
    .createQueryBuilder('gamer')
    .leftJoinAndSelect('gamer.user', 'user')
    .leftJoin('gamer.metrics', 'metrics')
    .addSelect(
      'COALESCE(SUM(CASE WHEN metrics.type = :golType THEN metrics.quantity ELSE 0 END), 0)',
      'totalGoals'
    )
    .setParameter('golType', 'gol')
    .groupBy('gamer.id')
    .addGroupBy('user.id')
    .orderBy('totalGoals', 'DESC')
    .getRawAndEntities();

  // 3. Jogador com mais defesas
  const topGoalkeeper = await gamerRepository
    .createQueryBuilder('gamer')
    .leftJoinAndSelect('gamer.user', 'user')
    .leftJoin('gamer.metrics', 'metrics')
    .addSelect(
      'COALESCE(SUM(CASE WHEN metrics.type = :defesaType THEN metrics.quantity ELSE 0 END), 0)',
      'totalSaves'
    )
    .setParameter('defesaType', 'defesa')
    .groupBy('gamer.id')
    .addGroupBy('user.id')
    .orderBy('totalSaves', 'DESC')
    .getRawAndEntities();

  return {
    topScorer: topScorer
      ? {
          id: topScorer.id,
          name: topScorer.user?.name,
          score: topScorer.score,
        }
      : null,
    topGoalScorer:
      topGoalScorer.entities.length > 0
        ? {
            id: topGoalScorer.entities[0]?.id,
            name: topGoalScorer.entities[0]?.user?.name,
            goals: parseInt(topGoalScorer.raw[0]?.totalGoals || '0'),
          }
        : null,
    topGoalkeeper:
      topGoalkeeper.entities.length > 0
        ? {
            id: topGoalkeeper.entities[0]?.id,
            name: topGoalkeeper.entities[0]?.user?.name,
            saves: parseInt(topGoalkeeper.raw[0]?.totalSaves || '0'),
          }
        : null,
  };
}

export async function getGamers(
  page: number = 1,
  limit: number = 10,
  id: number | null = null
) {
  const skip = (page - 1) * limit;

  // Criar query builder com relações
  let gamersQuery = gamerRepository
    .createQueryBuilder('gamer')
    .leftJoinAndSelect('gamer.user', 'user')
    .leftJoinAndSelect('gamer.team', 'team')
    .leftJoinAndSelect('gamer.metrics', 'metrics');

  // Aplicar filtro por ID se fornecido
  if (id) {
    gamersQuery = gamersQuery.where('gamer.id = :id', { id });
  }

  // Buscar todos os gamers (antes da paginação para contar total)
  const allGamers = await gamersQuery.getMany();

  // Ordenar por score (maior para menor)
  const sortedGamers = allGamers.sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  // Aplicar paginação
  const totalCount = sortedGamers.length;
  const gamers = sortedGamers.slice(skip, skip + limit);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    gamers,
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

export async function createGamer(body: any): Promise<Gamer> {
  const { shirtNumber, user, team } = body;
  const userId =
    typeof user === 'object' && user !== null && 'id' in user ? user.id : user;

  const gamersWithId = await gamerRepository.find({
    where: { user: { id: userId } },
  });
  if (gamersWithId.length > 0)
    throw new Error('Este usuário já possui um jogador.');

  if (team) {
    const teamId =
      typeof team === 'object' && team !== null && 'id' in team
        ? team.id
        : team;
    const gamer = {
      shirtNumber,
      user: { id: userId },
      team: { id: teamId },
    };
    const newGamer = gamerRepository.create(gamer);
    const savedGamer = await gamerRepository.save(newGamer);

    return (Array.isArray(savedGamer) ? savedGamer[0] : savedGamer) as Gamer;
  }

  const gamer = {
    shirtNumber,
    user: { id: userId },
  };
  const newGamer = gamerRepository.create(gamer);
  const savedGamer = await gamerRepository.save(newGamer);

  return (Array.isArray(savedGamer) ? savedGamer[0] : savedGamer) as Gamer;
}

export async function updateGamer(body: any) {
  const { id, shirtNumber, team, score } = body;
  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
      user: true,
    },
  });

  if (!gamer) throw new Error('Gamer não encontrado');

  const updateData: any = {};

  if (team !== undefined) {
    if (team === null) {
      // Permite definir team como null para remover o vínculo
      updateData.team = null;
    } else {
      const teamId =
        typeof team === 'object' && team !== null && 'id' in team
          ? team.id
          : team;
      updateData.team = { id: teamId };
    }
  }

  if (shirtNumber !== undefined) {
    updateData.shirtNumber = shirtNumber;
  }

  if (score !== undefined && score !== null) {
    const newScore = gamer.score + score;
    updateData.score = newScore;
  }

  if (Object.keys(updateData).length > 0) {
    await gamerRepository
      .createQueryBuilder()
      .update(Gamer)
      .set(updateData)
      .where('id = :id', { id: id })
      .execute();
  }

  // Usar o shirtNumber do gamer se não foi passado no body
  const finalShirtNumber =
    shirtNumber !== undefined ? shirtNumber : gamer.shirtNumber;
  const scoreInfo =
    score !== undefined && score !== null ? `, score atualizado` : '';

  // Verificar se o usuário existe antes de criar o log
  if (!gamer.user || !gamer.user.id) {
    throw new Error('Usuário associado ao gamer não encontrado');
  }

  return {
    text: 'Gamer editado com sucesso!',
    gamerInfo: { id: gamer.user.id, finalShirtNumber, scoreInfo },
  };
}

export async function deleteGamer(body: any) {
  const { id } = body;
  const gamer = await gamerRepository.findOne({
    where: { id },
    relations: {
      team: true,
      user: true,
    },
  });

  if (!gamer) throw new Error('Gamer não encontrado!');

  let teamData;
  if (gamer.team) {
    teamData = await AppDataSource.getRepository(Team).findOne({
      where: { id: gamer?.team?.id },
      relations: {
        matchesAsTeam1: true,
        matchesAsTeam2: true,
      },
    });
  }
  if (teamData?.matchesAsTeam1.some(match => match.status === 'playing'))
    throw new Error(
      'Gamer está em uma partida, portanto por enquanto não pode ser deletado!'
    );
  if (teamData?.matchesAsTeam2.some(match => match.status === 'playing'))
    throw new Error(
      'Gamer está em uma partida, portanto por enquanto não pode ser deletado!'
    );

  const userId = gamer.user?.id || null;

  // Deletar métricas relacionadas ao gamer antes de deletar o gamer
  const metricRepository = AppDataSource.getRepository(Metric);
  await metricRepository
    .createQueryBuilder()
    .delete()
    .from(Metric)
    .where('gamer_id = :gamerId', { gamerId: id })
    .execute();

  // Agora pode deletar o gamer sem violar a constraint de chave estrangeira
  await gamerRepository
    .createQueryBuilder()
    .delete()
    .from(Gamer)
    .where('id = :id', { id: id })
    .execute();

  return { text: `Gamer deletado com sucesso`, userId };
}
