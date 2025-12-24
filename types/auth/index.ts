export interface IAdmin {
  id: string;
  email: string;
  name: string;
  phone: string;
  permissions: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface IAdminDTO {
  name: string;
  email: string;
  password?: string;
  permissions: string[];
}

export interface IAuthState {
  admin: IAdmin | null;
  token: string | null;
}

export interface ILoginResponse {
  access_token: string;
  user: IAdmin;
}
