import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatDateToFundString(date: Date): string {
  const day = format(date, 'd', { locale: es });
  const month = format(date, 'MMMM', { locale: es });
  const year = format(date, 'yyyy');

  return `Al ${day} de ${month} del ${year}`;
}

export const firstLetterUppercase = (text: string): string =>
  text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const convertAmount = (amount: number) => {
  if (amount) {
    const parts = amount
      .toLocaleString('en', {
        minimumFractionDigits: 4,
      })
      .toString()
      .split('.');

    return parts[0] + '.' + parts[1].slice(0, 2);
  }
  return '0.00';
};
