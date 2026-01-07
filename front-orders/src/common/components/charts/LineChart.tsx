/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  defaults,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Tooltip,
} from 'chart.js';
import React, { FC } from 'react';
import { Line } from 'react-chartjs-2';

defaults.font.family = 'PrudentialModern';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const data: (
  labels: string[],
  data: number[],
  gradientPower: number
) => ChartData<'line'> = (
  labels: string[],
  data: number[],
  gradientPower: number
) => {
  return {
    labels,
    datasets: [
      {
        data,
        borderColor: '#BA93E1',
        borderWidth: 3.5,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            gradientPower || 250
          );
          gradient.addColorStop(0, '#BA93E1');
          gradient.addColorStop(1, '#FFFFFF');
          return gradient;
        },
        fill: 'start',
        tension: 0.5,
        pointRadius: 10,
        pointHoverRadius: 10,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
      },
    ],
  };
};

interface IProps {
  labels: string[];
  chartData: number[];
  gradientPower?: number;
}

export const LineChart: FC<IProps> = ({ labels, chartData, gradientPower }) => {
  return (
    <Line
      options={options}
      data={data(labels, chartData, gradientPower || 250)}
    />
  );
};

export const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: {
        color: '#CFD5D7',
        font: {
          size: 1,
          weight: 'bold',
        },
      },
    },
    tooltip: {
      bodyFont: {
        family: 'PrudentialModern',
      },
      titleFont: {
        family: 'PrudentialModern',
      },
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (context.parsed.y !== null) {
            label += ' ' + Number(context.raw).toFixed(4) + '%';
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          weight: 'bold',
          family: 'PrudentialModern',
          size: 12,
        },
        color: '#CFD5D7',
      },
      border: {
        color: 'transparent',
      },
    },
    y: {
      border: {
        dash: [4, 4],
        color: 'transparent',
      },
      ticks: {
        font: {
          weight: 'bold',
          family: 'PrudentialModern',
          size: 12,
        },
        color: '#CFD5D7',
      },
      beginAtZero: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
};
