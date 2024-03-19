import { Authentication, Authorization } from '@nestjs-cognito/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  CreateUserDTO,
  PaginateRequestDto,
  ServiceResponse,
  UpdateUserDTO,
} from '@app/common';
import { IUserRole } from '@app/types';
import { BaseRepository, UserModel } from '@app/database';
import { UsersService } from './users.service';

@Controller()
@ApiTags('Users')
@ApiBearerAuth()
@Authentication()
// @Authorization({ allowedGroups: [IUserRole.ADMIN] })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list')
  async getAll(@Query() query: PaginateRequestDto) {
    return new ServiceResponse(await this.usersService.getAll(query));
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) userId: string) {
    return new ServiceResponse(await this.usersService.deleteUser(userId));
  }

  @Put(':id')
  async edit(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() body: UpdateUserDTO
  ) {
    console.log('body');
    return new ServiceResponse(
      await this.usersService.updateUser(userId, body)
    );
  }

  @Post('create')
  async create(@Body() body: CreateUserDTO) {
    return new ServiceResponse(await this.usersService.createUser(body));
  }
}
