import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IUserRole } from '@app/types';
import { IsAlphanumericSpaces, constrainedMessage } from '@app/common';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsAlphanumericSpaces()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(IUserRole, { message: constrainedMessage() })
  @IsNotEmpty()
  group: IUserRole;

  @IsUUID()
  @IsOptional()
  sub?: string;
}
