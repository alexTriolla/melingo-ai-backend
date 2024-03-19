import { IsAlphanumericSpaces, RegexValidCognitoPassword, constrainedMessage } from '@app/common';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsAlphanumericSpaces()
  @IsNotEmpty()
  fullName: string;

  @Matches(RegexValidCognitoPassword, {
    message: constrainedMessage('PasswordMatchCognitoRules'),
  })
  @MinLength(8, { message: constrainedMessage() })
  password: string;
}
