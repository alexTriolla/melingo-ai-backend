import { Injectable } from '@nestjs/common';
import {
  CognitoValidationException,
  SignUpDto,
  configuration,
  ConfirmSignupDto,
  ResendConfirmationCodeDto,
  SignInDto,
  CreateUserDTO,
  generateRandomPassword,
  AddUserToGroupDTO,
  UpdateUserDTO,
  ForceChangePasswordDto,
} from '@app/common';

import {
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandOutput,
  AdminRemoveUserFromGroupCommand,
  AdminRemoveUserFromGroupCommandOutput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandOutput,
  AttributeType,
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  GetUserCommand,
  GetUserCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandOutput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';

import { LangService } from '@app/i18n';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserRole } from '@app/types';

@Injectable()
export class CognitoService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly clientId: string;
  private readonly userPool: string;

  constructor(
    private langService: LangService,
    private jwtService: JwtService
  ) {
    this.client = new CognitoIdentityProviderClient({
      region: configuration().cognitoRegion,
    });

    this.clientId = configuration().clientId;
    this.userPool = configuration().userPoolId;
  }

  private async sendCommand(command: any): Promise<any> {
    try {
      return await this.client.send(command);
    } catch (e: any) {
      throw new CognitoValidationException(
        this.langService.t(`auth.${e.message}` as any),
        e.name
      );
    }
  }

  async signUp({
    email,
    password,
    fullName,
  }: SignUpDto): Promise<SignUpCommandOutput> {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'custom:fullName', Value: fullName },
      ],
    });

    return this.sendCommand(command);
  }

  parseUserAttributes(attributes: AttributeType[], role?: IUserRole): IUser {
    return {
      role,
      ...attributes.reduce((acc, current) => {
        const key = current.Name.split(':').pop();

        acc[key] = current.Value;
        return acc;
      }, {} as IUser),
    };
  }

  parseUser(accessToken: string, user: GetUserCommandOutput): any {
    const decodedJwtAccessToken = this.jwtService.decode(accessToken);
    const userGroup = decodedJwtAccessToken['cognito:groups']?.[0] ?? null;

    return this.parseUserAttributes(user.UserAttributes, userGroup);
  }

  async getUser(accessToken: string): Promise<GetUserCommandOutput> {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    return this.sendCommand(command);
  }

  async confirmSignUp({
    email,
    code,
  }: ConfirmSignupDto): Promise<ConfirmSignUpCommandOutput> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    });

    return this.sendCommand(command);
  }

  async resendConfirmationCode({
    email,
  }: ResendConfirmationCodeDto): Promise<ResendConfirmationCodeCommandOutput> {
    const command = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: email,
    });

    return this.sendCommand(command);
  }

  async forceChangePassword({
    email,
    password,
    session,
  }: ForceChangePasswordDto): Promise<RespondToAuthChallengeCommandOutput> {
    const command = new RespondToAuthChallengeCommand({
      ClientId: this.clientId,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: password,
      },
    });

    return this.sendCommand(command);
  }

  async initiateAuth({
    email,
    password,
  }: SignInDto): Promise<InitiateAuthCommandOutput> {
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    return this.sendCommand(command);
  }

  async forgotPassword({ email }): Promise<ForgotPasswordCommandOutput> {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: email,
    });

    return await this.sendCommand(command);
  }

  async verifyForgotPassword({
    code,
    password,
    email,
  }): Promise<ConfirmForgotPasswordCommandOutput> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      ConfirmationCode: code,
      Password: password,
      Username: email,
    });

    return await this.sendCommand(command);
  }

  /// Admin Actions ///
  async deleteUser(sub: string): Promise<AdminDeleteUserCommandOutput> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPool,
      Username: sub,
    });

    return this.sendCommand(command);
  }

  async addUserToGroup(
    body: AddUserToGroupDTO
  ): Promise<AdminAddUserToGroupCommandOutput> {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPool,
      Username: body.email,
      GroupName: body.group,
    });

    return this.sendCommand(command);
  }

  async removeUserFromGroup(
    body: AddUserToGroupDTO
  ): Promise<AdminRemoveUserFromGroupCommandOutput> {
    const command = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.userPool,
      Username: body.email,
      GroupName: body.group,
    });

    return this.sendCommand(command);
  }

  async updateUserAttributes(
    sub: string,
    body: UpdateUserDTO
  ): Promise<AdminUpdateUserAttributesCommandOutput> {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPool,
      Username: sub,
      UserAttributes: [
        { Name: 'email', Value: body.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:fullName', Value: body.fullName },
        { Name: 'custom:role', Value: body.group },
      ],
    });

    return this.client.send(command);
  }

  async createUser(body: CreateUserDTO): Promise<AdminCreateUserCommandOutput> {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPool,
      Username: body.email,
      UserAttributes: [
        { Name: 'email', Value: body.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'custom:fullName', Value: body.fullName },
        { Name: 'custom:role', Value: body.group },
      ],

      TemporaryPassword: generateRandomPassword(),
    });

    return this.sendCommand(command);
  }
}
