import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

// Registra os elementos necessários do Chart.js
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  config: {
    type: 'radar';
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        [key: string]: unknown;
      }[];
    };
    options?: Record<string, unknown>;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ config }) => {
  const userOptions = config.options || {};
  const userScales = (userOptions.scales as Record<string, unknown>) || {};
  const userRScale = (userScales.r as Record<string, unknown>) || {};
  const userTicks = (userRScale.ticks as Record<string, unknown>) || {};

  const userGrid = (userRScale.grid as Record<string, unknown>) || {};
  const userAngleLines =
    (userRScale.angleLines as Record<string, unknown>) || {};

  // Calcula o valor máximo dos dados
  const maxDataValue = Math.max(
    ...config.data.datasets.flatMap(d => d.data),
    1
  );

  // Calcula stepSize como inteiro (no mínimo 1)
  const defaultStepSize = Math.max(1, Math.ceil(maxDataValue / 5));

  const mergedOptions = {
    ...userOptions,
    scales: {
      ...userScales,
      r: {
        ...userRScale,
        ticks: {
          ...userTicks,
          backdropColor: 'transparent',
          color: 'white',
          font: {
            size: (userTicks.font as { size?: number })?.size || 12,
            weight: 'bold' as const,
          },
          stepSize: (userTicks.stepSize as number) || defaultStepSize,
          precision: 0, // Garante que não mostra decimais
        },
        grid: {
          ...userGrid,
          color: 'gray',
        },
        angleLines: {
          ...userAngleLines,
          color: 'gray',
        },
      },
    },
  };

  return (
    <div
      className={cn(
        'w-full h-full',
        'flex justify-center items-center bg-card rounded-xl shadow-lg'
      )}
    >
      <div
        className={cn(
          'w-full h-full',
          'relative flex justify-center items-center'
        )}
      >
        <Radar data={config.data} options={mergedOptions} />
      </div>
    </div>
  );
};

export default RadarChart;
