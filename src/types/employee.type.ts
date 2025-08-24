export type Gender = "Nam" | "Nu"| "Khac";

export interface Employee {
  hashedPassword: string;
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string; 
  gender: Gender;
  phoneNumber: string;
  active: boolean;
  createdAt: string; 
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}