export interface IProfileFundsByCustomerResponse {
  data: IProfileFundsByCustomerData[];
}

export interface IProfileFundsByCustomerData {
  id: number;
  title: string;
  info_url: string;
  is_approved: boolean;
}
