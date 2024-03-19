import { RegexValidCognitoPassword, constrainedMessage } from '@app/common';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(6, { message: constrainedMessage() })
  @MaxLength(6, { message: constrainedMessage() })
  code: string;

  @Matches(RegexValidCognitoPassword, {
    message: constrainedMessage('PasswordMatchCognitoRules'),
  })
  @MinLength(8, { message: constrainedMessage() })
  password: string;
}
