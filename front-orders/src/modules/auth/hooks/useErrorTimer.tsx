/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

interface IProps {
  timer: any;
  key: string;
}

export const useErrorTimer = ({ timer, key }: IProps) => {
  useEffect(() => {
    if (timer[key] !== null && timer[key] !== 0 && timer[key] >= 0) {
      const interval = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timer.setTimer((prevState: any) => prevState - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer[key]]);

  if (!timer[key]) {
    return {
      currentTimer: '',
    };
  }

  const currentMinutes =
    Math.ceil(timer[key] / 60) - 1 === 0 && timer[key] === 60
      ? '01'
      : Math.ceil(timer[key] / 60) - 1 === 1 && timer[key] === 120
      ? '02'
      : Math.ceil(timer[key] / 60) - 1 === 2 && timer[key] === 180
      ? '03'
      : `0${Math.ceil(timer[key] / 60) - 1}`;

  const currentSeconds =
    timer[key] === 60 || timer[key] === 120 || timer[key] == 180
      ? '00'
      : timer[key] > 120
      ? timer[key] - 120
      : timer[key] > 60 && timer[key] <= 120
      ? timer[key] - 60
      : timer[key].length === 1
      ? `0${timer[key]}`
      : timer[key];

  return {
    currentTimer:
      currentMinutes +
      ':' +
      (currentSeconds.toString().length === 1
        ? `0${currentSeconds}`
        : currentSeconds) +
      ' min',
  };
};

export const transformTimestamp = (timer: any) => {
  const currentMinutes =
    Math.ceil(timer / 60) - 1 === 0 && timer === 60
      ? '1'
      : Math.ceil(timer / 60) - 1 === 1 && timer === 120
      ? '2'
      : Math.ceil(timer / 60) - 1 === 2 && timer === 180
      ? '3'
      : `${Math.ceil(timer / 60) - 1}`;

  const currentSeconds =
    timer === 60 || timer === 120 || timer == 180
      ? '0'
      : timer > 120
      ? timer - 120
      : timer > 60 && timer <= 120
      ? timer - 60
      : timer.length === 1
      ? `${timer}`
      : timer;

  return (
    (currentMinutes === '0' || currentMinutes === '-1'
      ? ''
      : currentMinutes + ' minuto' + (currentMinutes !== '1' ? 's' : '')) +
    (currentSeconds === '0'
      ? ''
      : (currentSeconds.toString() === '0' || currentMinutes === '0'
          ? ''
          : ' y ') +
        (currentSeconds.toString().length === 1
          ? `${currentSeconds}`
          : currentSeconds) +
        ' segundo' +
        (currentSeconds !== '1' ? 's' : ''))
  );
};
