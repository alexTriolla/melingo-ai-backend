export enum IUserRole {
  ADMIN = 'admin',
}

export type IUser = {
  id?: number; // DB Primary ID
  sub: string; // AWS Cognito User ID
  email_verified: boolean;
  email: string;
  name?: string;
  lastName?: string;
  datasetName?: string;
  usageLimitation?: number;
  welcomeEn?: string;
  welcomeHe?: string;
  lastLoginDate?: Date;
  role: IUserRole;
};

export type CreateUserResponse = {};

export type UpdateUserResponse = {};
