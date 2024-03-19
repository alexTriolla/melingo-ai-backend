import { RegexValidCognitoPassword, constrainedMessage } from '@app/common';
import { IsEmail, IsNotEmpty, IsString, Matches, Min, MinLength } from 'class-validator';

export class ForceChangePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(RegexValidCognitoPassword, {
    message: constrainedMessage('PasswordMatchCognitoRules'),
  })
  @MinLength(8, { message: constrainedMessage() })
  password: string;

  @MinLength(20, { message: constrainedMessage() })
  @IsNotEmpty()
  session: string;
}
