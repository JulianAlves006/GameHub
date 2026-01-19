import { AppDataSource } from '../../data-source.ts';
import { Gamer, Match, Metric } from '../entities/index.ts';

const metricRepository = AppDataSource.getRepository(Metric);

export async function getMetric(params: Metric) {
  const { id, match } = params;
  if (id && !match) {
    return await metricRepository.findOne({ where: { id } });
  } else if (match && !id) {
    return await metricRepository.findOne({ where: { match } });
  } else if (id && match) {
    return await metricRepository.findOne({ where: { id, match } });
  } else {
    return await metricRepository.find();
  }
}

export async function createMetric(
  body: Metric,
  user: { id: number; role: string }
) {
  const { quantity, type, description, match, gamer } = body;
  const matchId =
    typeof match === 'object' && match !== null && 'id' in match
      ? match.id
      : match;
  const matchData = await AppDataSource.getRepository(Match).findOne({
    where: { id: matchId },
    relations: { championship: { admin: true } },
  });
  if (!matchData) {
    throw new Error('Partida informada não encontrada!');
  }
  if (matchData.championship.admin.id !== user.id)
    throw new Error('Este usuário não pode realizar esta ação!');

  const gamerId =
    typeof gamer === 'object' && gamer !== null && 'id' in gamer
      ? gamer.id
      : gamer;
  const gamerData = await AppDataSource.getRepository(Gamer).findOne({
    where: { id: gamerId as number },
  });
  if (!gamerData) {
    throw new Error('Gamer informado não encontrado!');
  }
  const metric = {
    quantity,
    type,
    description,
    match,
    gamer,
  };
  const newMetric = metricRepository.create(metric);
  await metricRepository.save(newMetric);

  return { newMetric, type, quantity, gamerId };
}
