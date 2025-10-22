export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  token: string;
}
