export interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
}

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface AccessToken {
  accessToken: string;
}
