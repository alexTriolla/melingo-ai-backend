import { IUser } from './user';

export type SignUpResponse = {
  userConfirmed: boolean;
};

export type SignInResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: IUser;
  newPasswordRequired?: boolean;
  session?: string;
};

export type ConfirmSignupResponse = {};

export type ResendConfirmationCodeResponse = {};

export type ForgotPasswordResponse = {};

export type VerifyForgotPasswordResponse = {};
