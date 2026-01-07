export enum MoneyTypeEnum {
  PEN = 'Soles',
  USD = 'Dólares',
  CAD = 'Dólar Canadiense',
  CLP = 'Peso Chileno',
  COP = 'Peso Colombiano',
  MXN = 'Peso Mexicano',
  BRL = 'Real Brasileño',
}

export const SpectrumMoneyType: {
  [key in MoneyTypeEnum]: string;
} = {
  [MoneyTypeEnum.PEN]: '01',
  [MoneyTypeEnum.USD]: '02',
  [MoneyTypeEnum.CAD]: '09',
  [MoneyTypeEnum.CLP]: '27',
  [MoneyTypeEnum.COP]: '25',
  [MoneyTypeEnum.MXN]: '26',
  [MoneyTypeEnum.BRL]: '10',
};

export const SpectrumMoneyTypeKey: {
  [key in MoneyTypeEnum]: keyof typeof MoneyTypeEnum;
} = {
  [MoneyTypeEnum.PEN]: 'PEN',
  [MoneyTypeEnum.USD]: 'USD',
  [MoneyTypeEnum.CAD]: 'CAD',
  [MoneyTypeEnum.CLP]: 'CLP',
  [MoneyTypeEnum.COP]: 'COP',
  [MoneyTypeEnum.MXN]: 'MXN',
  [MoneyTypeEnum.BRL]: 'BRL',
};

export enum SpectrumConverted {
  PEN = 'S/.',
  USD = 'US$',
}

export enum SpectrumMoneyTypeConverted {
  PEN = 'S/.',
  USD = '$',
}
