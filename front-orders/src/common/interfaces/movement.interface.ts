export interface IMovementResponse {
  data: IMovement[];
  total: number;
  limit: number;
  page: number;
}

export interface IMovement {
  id: number;
  fund_id: number;
  tipoSolicitud: string;
  fechaSolicitud: string;
  descripFondo: string;
  descripFondoSerie: string;
  descripParametro: string;
  moneda: string;
  terms_and_conditions: boolean;
  origin_conditions: boolean;
  account_fund_id: string;
  fund_origin: string;
  montoNetoSolicitud: number;
  constancy_url: string;
  internal_transfer: boolean;
}
