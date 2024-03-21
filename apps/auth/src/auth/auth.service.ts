import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { InjectModel } from '@nestjs/sequelize';
import { HttpStatus, Injectable } from '@nestjs/common';

import { CognitoService } from '@app/aws';
import {
  ConfirmSignupDto,
  ForceChangePasswordDto,
  ForgotPasswordDto,
  ResendConfirmationCodeDto,
  SignInDto,
  SignUpDto,
  TranslatedException,
  VerifyForgotPasswordDto,
} from '@app/common';
import {
  BaseResponse,
  ConfirmSignupResponse,
  ForgotPasswordResponse,
  ResendConfirmationCodeResponse,
  SignInResponse,
  SignUpResponse,
  VerifyForgotPasswordResponse,
} from '@app/types';
import { LangService } from '@app/i18n';
import {
  CompanyModel,
  DatabaseErrors,
  UserModel,
  UserTransformer,
} from '@app/database';

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly langService: LangService,
    private userTransformer: UserTransformer,
    @InjectModel(UserModel)
    private userRepo: typeof UserModel
  ) {}

  async signUp(body: SignUpDto): Promise<BaseResponse<SignUpResponse>> {
    const result = await this.cognitoService.signUp(body);
    const { UserSub, UserConfirmed } = result;

    return {
      userConfirmed: UserConfirmed,
      message: this.langService.t('auth.SignedUpSuccessfully'),
    };
  }

  async forceChangePassword(
    body: ForceChangePasswordDto
  ): Promise<BaseResponse<SignInResponse>> {
    // Validate that the user exists, if not throw an error
    const userExists = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!userExists) {
      throw new TranslatedException(
        DatabaseErrors.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    // Initiate force change password against cognito service
    await this.cognitoService.forceChangePassword(body);

    return {
      message: this.langService.t('auth.PasswordChangedSuccessfully'),
    };
  }

  async signIn(body: SignInDto): Promise<BaseResponse<SignInResponse>> {
    // Validate that the user exists, if not throw an error
    const userExists = await this.userRepo.findOne({
      where: { email: body.email },
      include: [
        {
          model: CompanyModel,
          attributes: [
            'createdAt',
            'updatedAt',
            'businessName',
            'email',
            'phone',
            'fax',
            'displayLinks',
            'linkWithPicture',
            'chatbotPosition',
            'chatbotName',
            'chatbotSubtitle',
            'themeColor',
            'fontColor',
            'buttonColor',
            'backgroundPattern',
            'logo',
          ],
        },
      ],
    });

    if (!userExists) {
      throw new TranslatedException(
        DatabaseErrors.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    // Initiate auth against cognito service
    // (we don't need to validate the password here, cognito will do that for us)
    const result = await this.cognitoService.initiateAuth(body);

    // If the user needs to change their password, return a message to the user
    if (result.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      return {
        newPasswordRequired: true,
        session: result.Session,
        message: this.langService.t('auth.NewPasswordRequired'),
        messageType: 'error',
      };
    }

    const { AccessToken, RefreshToken } = result.AuthenticationResult;

    return {
      user: await this.userTransformer.toJson(userExists),
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    };
  }

  async confirmSignup(
    body: ConfirmSignupDto
  ): Promise<BaseResponse<ConfirmSignupResponse>> {
    await this.cognitoService.confirmSignUp(body);

    return {
      message: this.langService.t('auth.SignedUpSuccessfully'),
    };
  }

  async resendConfirmationCode(
    body: ResendConfirmationCodeDto
  ): Promise<BaseResponse<ResendConfirmationCodeResponse>> {
    await this.cognitoService.resendConfirmationCode({
      email: body.email,
    });

    return {
      message: this.langService.t('auth.CheckYourEmailForConfirmationCode'),
    };
  }

  async forgotPassword(
    body: ForgotPasswordDto
  ): Promise<BaseResponse<ForgotPasswordResponse>> {
    await this.cognitoService.forgotPassword(body);

    return {
      message: this.langService.t('auth.CheckYourEmailForConfirmationCode'),
    };
  }

  async verifyForgotPassword(
    body: VerifyForgotPasswordDto
  ): Promise<BaseResponse<VerifyForgotPasswordResponse>> {
    await this.cognitoService.verifyForgotPassword(body);

    return {
      message: this.langService.t('auth.PasswordChangedSuccessfully'),
    };
  }
}
