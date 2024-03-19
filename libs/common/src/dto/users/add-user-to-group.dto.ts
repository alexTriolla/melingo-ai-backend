import { IUserRole } from '@app/types';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { constrainedMessage } from '@app/common';

export class AddUserToGroupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(IUserRole, { message: constrainedMessage() })
  @IsNotEmpty()
  group: IUserRole;
}
