export interface Customer {
  id: string;
  fullName: string;
  email: string;
  registrationDate: string;
}

export interface ApiResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}