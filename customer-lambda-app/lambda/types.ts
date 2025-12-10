export interface Customer {
  id: string;
  fullName: string;
  email: string;
  registrationDate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}