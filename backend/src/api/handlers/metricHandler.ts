import type { Metric } from '../entities/index.ts';
import { createLog } from '../repositories/logRepository.ts';
import { createMetric, getMetric } from '../repositories/metricRepository.ts';
import { createMetricValidation } from '../validations/validations.ts';

export async function getMetricHandler(params: Metric) {
  try {
    const response = await getMetric(params);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no getMetricHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao buscar metricas'
    );
  }
}

export async function createMetricHandler(
  body: Metric,
  user: { id: number; role: string }
) {
  try {
    createMetricValidation(body, user);
    const response = await createMetric(body, user);
    await createLog(
      user.id,
      'CREATE_METRIC',
      `Métrica criada: ${response.type} (quantidade: ${response.quantity}) para gamer ${response.gamerId} (ID: ${response.newMetric.id})`
    );
    return response.newMetric;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erro no createMetricHandler:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao criar metrica'
    );
  }
}
