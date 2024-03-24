import {
  Authentication,
  AuthenticationGuard,
  CognitoUser,
} from '@nestjs-cognito/auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

import { ServiceResponse } from '@app/common';
import { IUser } from '@app/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@Authentication()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticationGuard)
  async getUser(@CognitoUser() user: IUser) {
    console.log('user', user);
    return new ServiceResponse(await this.userService.findUser(user));
  }

  @Get('check-session')
  @UseGuards(AuthenticationGuard)
  async checkSession(@CognitoUser() user: IUser) {
    return new ServiceResponse({
      message: 'Session is valid',
      user: await this.userService.findUser(user),
    });
  }
}
