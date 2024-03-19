import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
  BaseRepository,
  DatabaseErrors,
  OrderDir,
  UserModel,
  UserTransformer,
} from '@app/database';
import { BaseResponse, IUser, IUserRole } from '@app/types';
import { CreateUserDTO, UpdateUserDTO } from '@app/common/dto/users';
import { CognitoService } from '@app/aws';
import { PaginateRequestDto, TranslatedException } from '@app/common';

@Injectable()
export class UsersService {
  repository: BaseRepository<UserModel>;

  constructor(
    @InjectModel(UserModel)
    private userRepo: typeof UserModel,
    private userTransformer: UserTransformer,
    private cognitoService: CognitoService
  ) {
    this.repository = new BaseRepository<UserModel>(userRepo);
  }

  async userByUUID(uuid: string): Promise<IUser> {
    return await this.repository.findOne({ where: { sub: uuid } });
  }

  async getAll(query: PaginateRequestDto) {
    const isPaginate = !!query.per_page;

    return this.repository[isPaginate ? 'paginate' : 'getAll'](
      {
        orderBy: query.order_by,
        orderDir: query.order_dir || OrderDir.ASC,
        withTrashed: query.withTrashed === '1',
        filter_key: query.filter_key,
        filter_value: query.filter_value,
        search: query.search,
        fields: query.fields,
        include: query.include?.split(','),
        ...(isPaginate && {
          perPage: query.per_page,
          page: query.page || 1,
        }),
      },
      this.userTransformer
    );
  }

  async deleteUser(userId: string): Promise<BaseResponse<boolean>> {
    const user = await this.userByUUID(userId);

    // Delete user from Cognito
    const response = await this.cognitoService.deleteUser(userId);

    // If user was not updated, throw an error
    if (response.$metadata.httpStatusCode !== 200) {
      throw new TranslatedException(
        DatabaseErrors.FAILED_DELETE_COGNITO,
        HttpStatus.FORBIDDEN
      );
    }

    const deleted = await this.repository.delete({ where: { id: user.id } });

    if (!deleted) {
      throw new TranslatedException(
        DatabaseErrors.FAILED_DELETE_COGNITO,
        HttpStatus.FORBIDDEN
      );
    }

    return true;
  }

  /**
   * Update user
   * @param userId
   * @param body
   * @returns boolean
   */
  async updateUser(
    userId: string,
    body: UpdateUserDTO
  ): Promise<BaseResponse<IUser>> {
    // Find user by UUID
    const user = await this.userByUUID(userId);

    // Update user in Cognito
    const update = await this.cognitoService.updateUserAttributes(userId, body);

    // If user was not updated, throw an error
    if (update.$metadata.httpStatusCode !== 200) {
      throw new TranslatedException(
        DatabaseErrors.FAILED_UPDATE_COGNITO,
        HttpStatus.FORBIDDEN
      );
    }

    // If user group was updated, re-add user to new group
    if (user.role !== body.group) {
      await this.cognitoService.removeUserFromGroup({
        email: body.email,
        group: user.role as IUserRole,
      });

      await this.cognitoService.addUserToGroup({
        email: body.email,
        group: user.role,
      });
    }

    // Update user in database
    const updatedUser = await this.repository.updateById(user.id, body);

    return await this.userTransformer.toJson(updatedUser);
  }

  /**
   * Create user
   * @param body
   * @returns boolean
   */
  async createUser(body: CreateUserDTO): Promise<BaseResponse<IUser>> {
    // Check if user exists, if so, throw an error
    await this.repository.userExists({ where: { email: body.email } });

    // Create user in Cognito
    const cognitoUser = await this.cognitoService.createUser(body);

    // If user was not created, throw an error
    if (cognitoUser.$metadata.httpStatusCode !== 200) {
      throw new TranslatedException(
        DatabaseErrors.FAILED_CREATE_COGNITO,
        HttpStatus.FORBIDDEN
      );
    }

    // If user was created, add user to group
    await this.cognitoService.addUserToGroup({
      email: body.email,
      group: body.group,
    });

    // Create user in database
    const user = await this.repository.create({
      ...body,
      sub: cognitoUser.User.Username,
    });

    return await this.userTransformer.toJson(user);
  }
}
