import { toast } from 'react-toastify';
import api from './axios';

export function formatDateFullText(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateBrazil(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export async function createNotifications(
  type: string,
  user_id: number,
  gamer_id: number,
  description: string,
  teamID: number
) {
  if (!type || !user_id || !gamer_id) {
    toast.error('Todas as informações devem ser preenchidas!');
    return;
  }
  try {
    await api.post('/notifications', {
      type,
      user_id,
      gamer_id,
      description,
      teamID,
    });
    toast.success('Notificação enviada com sucesso!');
  } catch (error: any) {
    toast.error(
      error?.response?.data?.error || 'Falha ao marcar notificações como lidas'
    );
  }
}

export async function markNotificationsAsRead(ids: number[]) {
  if (!ids.length) return;
  try {
    await api.put('/notifications', {
      ids,
      read: true,
    });
  } catch (error: any) {
    toast.error(
      error?.response?.data?.error || 'Falha ao marcar notificações como lidas'
    );
  }
}

export function getUser() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

// Mapeamento de tipos de métricas para labels formatados
export const metricTypeMap: Record<string, string> = {
  gol: 'Gol',
  defesa: 'Defesa',
  falta: 'Falta',
  'chute ao gol': 'Chute ao gol',
  assistencia: 'Assistencia',
  'cartao amarelo': 'Cartao amarelo',
  'cartao vermelho': 'Cartao vermelho',
};

/**
 * Soma métricas de um array para um objeto por tipo
 * @param metricsArray - Array de métricas com propriedades type e quantity
 * @returns Objeto com as métricas somadas por tipo (ex: { gol: 10, falta: 5 })
 */
export function sumMetrics(
  metricsArray: { type: string; quantity: number }[] | undefined | null
): Record<string, number> {
  const metricsSum: Record<string, number> = {};

  if (!metricsArray || !Array.isArray(metricsArray)) {
    return metricsSum;
  }

  metricsArray.forEach((metric: { type: string; quantity: number }) => {
    const metricType = metric.type?.toLowerCase() || '';
    const quantity = metric.quantity || 0;

    if (metricType) {
      if (!metricsSum[metricType]) {
        metricsSum[metricType] = 0;
      }
      metricsSum[metricType] += quantity;
    }
  });

  return metricsSum;
}

interface FormatMetricsForChartParams {
  metrics:
    | Record<string, number>
    | { type: string; quantity: number }[]
    | undefined
    | null;
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
}

/**
 * Formata métricas para o formato do gráfico Radar
 * Aceita tanto um objeto já somado quanto um array de métricas (que será somado internamente)
 * @param metrics - Objeto com as métricas somadas (ex: { gol: 10, falta: 5 }) ou array de métricas
 * @param label - Nome que aparecerá na legenda do gráfico
 * @param backgroundColor - Cor de fundo do gráfico (padrão: rgba roxo)
 * @param borderColor - Cor da borda do gráfico (padrão: rgb roxo)
 * @returns Objeto formatado para o componente RadarChart
 */
export function formatMetricsForChart({
  metrics,
  label = 'Time',
  backgroundColor = 'rgba(106, 5, 249, 0.2)',
  borderColor = 'rgb(106, 5, 249)',
}: FormatMetricsForChartParams) {
  // Se for array, soma as métricas primeiro
  let metricsSummed: Record<string, number>;
  if (Array.isArray(metrics)) {
    metricsSummed = sumMetrics(metrics);
  } else {
    metricsSummed = metrics || {};
  }

  const labels = Object.keys(metricTypeMap);
  const dataValues = labels.map(label => {
    const value = metricsSummed[label] || 0;
    return value;
  });

  return {
    labels: Object.values(metricTypeMap),
    datasets: [
      {
        label,
        data: dataValues,
        fill: true,
        backgroundColor,
        borderColor,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColor,
      },
    ],
  };
}

export async function addScore(score: number, gamer: number) {
  try {
    await api.put('/gamer', {
      id: gamer,
      score,
    });
    toast.success('Score adicionado com sucesso!');
  } catch (error: any) {
    toast.error(
      error?.response?.data?.error || 'Falha ao marcar notificações como lidas'
    );
  }
}
