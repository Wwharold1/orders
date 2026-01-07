import { IErrorType } from '@/common/interfaces/natural.client.interface';

export interface IMakeAmlResponse {
  data: IMakeAml;
  error: IErrorType;
}

export interface IMakeAml {
  aml_success: boolean;
  user_blocked: boolean;
}
