export interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  name: string;
  email: string;
}
