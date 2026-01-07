export interface IShowRiskProfileResponse {
  data: IRiskProfile;
}

export interface IRiskProfile {
  id: number;
  formName: string;
  created_at: string;
  updated_at: string;
  status: number;
  questions: IRiskQuestion[];
}

export interface IRiskQuestion {
  id: number;
  title: string;
  questionnaireId: number;
  created_at: string;
  updated_at: string;
  options: IRiskOption[];
}

export interface IRiskOption {
  id: number;
  title: string;
  score: number;
  questionsId: number;
  created_at: string;
  updated_at: string;
}

export interface IRegisterProfileRequest {
  questionnaireId: number;
  total_score: number;
  questionAnswers: IQuestionAnswer[];
}

export interface IQuestionAnswer {
  questionId: number;
  optionId: number;
  score: number;
}

export interface IRegisterProfileResponse {
  response: IProfileResponse;
  profilesRisk: IProfilesRisk[];
}

export interface IProfileResponse {
  total_score: number;
  customer_risk_profile: string;
  customer_id: string;
  risk_profile_id: number;
  qestionnaire_id: number;
  constancy_url: string;
  constancy_date: string;
  id: number;
  status: number;
  detail: string;
  subtitle: string;
}

export interface IProfilesRisk {
  id: number;
  name: string;
  subtitle: string;
  rangeMax: number;
  detail: string;
}
