export const MoneyTypeSymbolEnum = {
  Dólares: '$ ',
  Soles: 'S/.',
};

export enum TypeMovementEnum {
  SUBSCRIPTION = 'Suscripción',
  RESCUE = 'Rescate',
}

export enum MovementStatusEnum {
  PENDING = 'Pendiente',
  INPROGRESS = 'En proceso',
  APPROVED = 'Aprobada',
}

export interface IMovementStatus {
  type: MovementStatusEnum;
  background: string;
  font: string;
}

export const MovementStatusData: IMovementStatus[] = [
  {
    type: MovementStatusEnum.INPROGRESS,
    background: '#F5EAF3',
    font: '#CF70AF',
  },
  {
    type: MovementStatusEnum.PENDING,
    background: '#F6F0FB',
    font: '#A36FD7',
  },
  {
    type: MovementStatusEnum.APPROVED,
    background: '#EEF5EB',
    font: '#83B36E',
  },
];

export enum MovementTypesEnum {
  SUSCRIPCION = 'Suscripción',
  RESCATE = 'Rescate',
  TRANSFERENCIA = 'Transferencia',
}

export enum MovementValuesEnum {
  TODOS = 0,
  SUSCRIPCION = 1,
  RESCATE = 2,
  TRANSFERENCIA = 3,
}

export interface IMovementTabs {
  title: string;
  value: MovementValuesEnum;
  filter?: MovementTypesEnum;
  plural?: string;
}

export const MovementTabs: IMovementTabs[] = [
  {
    title: 'Todos',
    value: MovementValuesEnum.TODOS,
    plural: 'movimientos',
  },
  {
    title: 'Inversión',
    value: MovementValuesEnum.SUSCRIPCION,
    filter: MovementTypesEnum.SUSCRIPCION,
    plural: 'inversiones',
  },
  {
    title: 'Rescate',
    value: MovementValuesEnum.RESCATE,
    filter: MovementTypesEnum.RESCATE,
    plural: 'rescates',
  },
  {
    title: 'Transferencia',
    value: MovementValuesEnum.TRANSFERENCIA,
    filter: MovementTypesEnum.TRANSFERENCIA,
    plural: 'transferencias',
  },
];
