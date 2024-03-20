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
  company?: {
    createdAt: Date;
    updatedAt: Date;
    businessName: string;
    email: string;
    phone: string;
    fax: string;
    displayLinks: boolean;
    linkWithPicture: boolean;
    chatbotPosition: string;
    chatbotName: string;
    chatbotSubtitle: string;
    themeColor: string;
    fontColor: string;
    buttonColor: string;
    backgroundPattern: string;
    logo: string;
  };
};

export type CreateUserResponse = {};

export type UpdateUserResponse = {};
