
export interface IConfirmationResponse {
  data: boolean;
  error: any;
}

export interface ILoginResponse {
  user: any;
  token: string;
}

export interface ILogin {
  email: string;
  password: string;
}
