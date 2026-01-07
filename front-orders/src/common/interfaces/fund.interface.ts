export type TShowFundResponse = IFund[];

export interface IFund {
  id: number;
  codFund: string;
  title: string;
  structure: IFundStructure;
  info_url: string;
  status: number;
  spectrumFund: ISpectrumFund;
  imageCard: string;
  imageHeader: string;
}

export interface ISpectrumFund {
  codFondo: string;
  codAdministradora: string;
  descripFondo: string;
  numRucFondo: string;
  codFondoSerie: string;
  descripFondoSerie: string;
  moneda: string;
  codCategoria: string;
  quotaValue: IQuotaValue;
}

export interface IQuotaValue {
  cantCuotaInicio: number;
  cantCuotaInicioPagada: number;
  codMoneda: string;
  codPlanContable: string;
  fechaCuota: string;
  indSerieMultiple: string;
  tipoFondo: string;
  valorCuotaInicial: number;
  valorCuotaInicialReal: number;
  valorCuotaNominal: number;
  valorTipoCambio: number;
}

export interface IFundStructure {
  content: IFundContent;
  briefcase: IFundBriefcase;
  riskLevel: IFundRiskLevel;
  description: string;
  performance: IFundPerformance;
  sub_description: string;
  investmentStrategy: IFundInvestmentStrategy;
  results: IFundResults;
}

export interface IFundPublicity {
  title: string;
  visibility: boolean;
}

export interface IFundResults {
  title: string;
  data: IFundResultsData[];
  visibility: boolean;
}
export interface IFundContent {
  document: string;
  features: IFundContentFeatures;
  disclaimer: string;
  disclaimerTitle: string;
  commissions: IFundContentCommissions;
  disclaimerVisibility: boolean;
  publicity: IFundPublicity;
}

export interface IFundContentFeatures {
  data: IFundContentFeaturesData[];
  title: string;
  visibility: boolean;
}

export interface IFundContentFeaturesData {
  title: string;
  habitat: string;
  description: string;
}

export interface IFundContentCommissions {
  data: IFundContentCommissionsData[];
  title: string;
  visibility: boolean;
}

export interface IFundContentCommissionsData {
  title: string;
  habitat: string;
  description: string;
}

export interface IFundBriefcase {
  data: IFundBriefcaseData[];
  title: string;
  visibility: boolean;
  description: string;
}

export interface IFundBriefcaseData {
  name: string;
  color: string;
  graphicValue: string;
}

export interface IFundRiskLevel {
  name: string;
  color: string;
  riskData: number;
  visibility: boolean;
  informationTitle: string;
}

export interface IFundPerformance {
  data: IFundPerformanceData[];
  title: string;
  monthTitle: string;
  monthCards: IFundPerformanceMonthCard[];
  visibility: boolean;
  description: string;
  monthTitleVisibility: boolean;
  titleVisibility: boolean;
}

export interface IFundPerformanceData {
  year: string;
  total: string;
}
export interface IFundResultsData {
  description: string;
  total: string;
}

export interface IFundPerformanceMonthCard {
  year: string;
  total: string;
}

export interface IFundInvestmentStrategy {
  data: IFundInvestmentStrategyData[];
  visibility: boolean;
  description: string;
  strategyTitle: string;
  legalInformation: string;
  graphicTitle: string;
}

export interface IFundInvestmentStrategyData {
  name: string;
  color: string;
  graphicValue: string;
}

export interface IFundSpectrum {
  codFondo: string;
  codAdministradora: string;
  descripFondo: string;
  codFondoSerie: string;
  descripFondoSerie: string;
  numCertificado: string;
  fechaSuscripcion: string;
  valorCuota: number;
  cantCuotas: number;
  valorCuotaActual: number;
  moneda: string;
  fechaCuotaActual: string;
  montoInversionInicial: number;
  montoRescate: number;
  beneficioDeInversion: number;
  estado: string;
  numCertificadoEliminado: string;
}

export interface IFundPeriod {
  code: string;
  month: string;
  year: string;
}

export interface IFundByUser {
  fundData: IFundSpectrum;
  fundPeriods: IFundPeriod[];
}

export interface IFundByUserResponse {
  data: IFundByUser;
}

export interface IFundByUserRequest {
  numIdentidad: string;
  tipoIdentidad: string;
}

export interface IDownloadEECCRequest {
  searchFund: IFundSearchProduct;
  searchUser: IFundSearchUser;
}

export interface IFundSearchProduct {
  fondo: string;
  periodo: string;
  mes: string;
  serie: string;
}

export interface IDownloadEECCMutation {
  abort: AbortController;
  fundSearch: IFundSearchProduct;
}

export interface IFundSearchUser {
  numIdentidad: string;
  tipoIdentidad: string;
}

export enum ETypeDocument {
  DNI = '01',
  RUC = '04',
  PASSPORT = '05',
  CE = '03',
  OTRO = '00',
}

export interface IProfileFundResponse {
  data: IProfileFundData;
  limit: string;
  page: string;
  total: number;
}

export interface IProfileFundData {
  profilesFunds: IProfilesFund[];
  funds: IFund[];
  profiles: IProfile[];
}

export interface IProfilesFund {
  id: number;
  profileId: number;
  fundId: number;
  visible: boolean;
  recommended: boolean;
}

export interface IProfile {
  id: number;
  name: string;
  subtitle: string;
  rangeMax: number;
  detail: string;
}
