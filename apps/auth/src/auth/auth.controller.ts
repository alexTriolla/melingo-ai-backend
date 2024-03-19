import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CognitoService } from '@app/aws';
import { AuthService } from './auth.service';
import {
  ServiceResponse,
  ConfirmSignupDto,
  ForgotPasswordDto,
  ResendConfirmationCodeDto,
  SignInDto,
  SignUpDto,
  VerifyForgotPasswordDto,
  ForceChangePasswordDto,
} from '@app/common';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private cognitoService: CognitoService,
    private authService: AuthService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup' })
  async signUp(@Body() dto: SignUpDto) {
    return new ServiceResponse(await this.authService.signUp(dto));
  }

  @Post('confirm-signup')
  @ApiOperation({ summary: 'Confirm Signup' })
  async confirmSignUp(@Body() dto: ConfirmSignupDto) {
    return new ServiceResponse(await this.authService.confirmSignup(dto));
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return new ServiceResponse(await this.authService.signIn(dto));
  }

  @Post('resend-confirmation-code')
  @ApiOperation({ summary: 'Resend Confirmation Code' })
  async resendConfirmationCode(@Body() dto: ResendConfirmationCodeDto) {
    return new ServiceResponse(
      await this.authService.resendConfirmationCode(dto)
    );
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return new ServiceResponse(await this.authService.forgotPassword(dto));
  }

  @Post('verify-forgot-password')
  @ApiOperation({ summary: 'Verify Forgot password' })
  async verifyForgotPassword(@Body() dto: VerifyForgotPasswordDto) {
    return new ServiceResponse(
      await this.authService.verifyForgotPassword(dto)
    );
  }

  @Post('force-change-password')
  @ApiOperation({ summary: 'Force Change password' })
  async forceChangePassword(@Body() dto: ForceChangePasswordDto) {
    return new ServiceResponse(await this.authService.forceChangePassword(dto));
  }
}
