import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
