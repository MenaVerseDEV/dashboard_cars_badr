export interface ICustomPermissions {
  read: boolean;
  create: boolean;
  delete: boolean;
  module: string;
  update: boolean;
}
export interface IAdminDTO {
  username: string;
  email: string;
  password?: string;
  customPermissions: ICustomPermissions[];
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface IAdmin {
  id: string;
  username: string;
  customPermissions: ICustomPermissions[];
  email: string;
  createdAt: string;
}

export interface IAuthState {
  admin: IAdmin | null;
  token: string | null;
}
