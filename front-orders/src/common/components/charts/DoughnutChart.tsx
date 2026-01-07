/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  defaults,
  Legend,
  Tooltip,
} from 'chart.js';
import React, { FC, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { MediaQueryEnum } from '@/common/enums';
import useMediaQuery from '@/common/hooks/useMediaQuery';

import CustomLegend from './CustomLegend';

defaults.font.family = 'PrudentialModern';

const options: (isMdDown: boolean) => ChartOptions<'doughnut'> = (
  isMdDown: boolean
) => {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        align: 'center',
        position: 'bottom',
        labels: {
          pointStyle: 'rect',
          usePointStyle: true,
          color: '#9BA6AC',
          font: {
            weight: 'normal',
            size: 20,
          },
          padding: isMdDown ? 5 : 8,
        },

        onClick: () => {
          return;
        },
      },
    },
    responsive: true,
    layout: {
      padding: 0,
    },
    aspectRatio: 2,
  } as ChartOptions<'doughnut'>;
};

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);
ChartJS.register({
  id: 'custom-modifier',
  beforeInit(chart: any) {
    const originalFit = chart.legend.fit;
    // Override the fit function
    chart.legend.fit = function fit() {
      // Call original function and bind scope in order to use `this` correctly inside it
      originalFit.bind(chart.legend)();
      // Change the height as suggested in another answers
      this.height += 15;
    };
  },
});

interface IProps {
  labels: string[];
  chartData: number[];
  colors: string[];
  sum: number;
}

const data: (
  labels: string[],
  data: number[],
  colors: string[],
  sum: number
) => ChartData<'doughnut'> = (
  labels: string[],
  data: number[],
  colors: string[]
) => {
  return {
    labels: labels?.map((label, index) =>
      label.concat(` (${data[index]}` + '%)')
    ),
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        label: 'Total (%)',
      },
    ],
  };
};

export const DoughnutChart: FC<IProps> = ({
  labels,
  chartData,
  colors,
  sum,
}) => {
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const [showLegend, setShowLegend] = useState<boolean>(false);

  const handleShowLegend = () => {
    setShowLegend(!showLegend);
  };
  const plugin = [
    {
      id: `custom-plugin-${(Math.random() * 100).toString()}`,
      beforeInit(chart: any) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;
        // Override the fit function
        chart.legend.fit = function fit() {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Specify what you want to change, whether the height or width

          // this.height = 130;
          this.width = 400;
        };
      },
    },
  ];
  return (
    <>
      <div className='relative'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <Doughnut
            plugins={plugin}
            style={{ height: 400, marginTop: 10 }}
            data={data(labels, chartData, colors, sum)}
            options={options(isMdDown)}
          />
        </div>
        <div
          onClick={handleShowLegend}
          className='cursor-pointer text-center text-[#0066CC]'
        >
          <p>{!showLegend ? 'Ver' : 'Ocultar'} leyenda</p>
        </div>
        <CustomLegend
          labels={data(labels, chartData, colors, sum).labels as string[]}
          colors={
            data(labels, chartData, colors, sum).datasets[0]
              .backgroundColor as string[]
          }
          showLegend={showLegend}
          sendEventShowLegend={handleShowLegend}
        />
      </div>
    </>
  );
};
