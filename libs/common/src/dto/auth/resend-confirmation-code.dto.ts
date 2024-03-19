import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendConfirmationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
