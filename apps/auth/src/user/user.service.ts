import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DatabaseErrors, UserModel, UserTransformer } from '@app/database';
import { IUser } from '@app/types';
import { TranslatedException } from '@app/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userRepo: typeof UserModel,
    private userTransformer: UserTransformer
  ) {}

  async findUser(user: IUser): Promise<IUser> {
    const userEntity = await this.userRepo.findOne({
      where: {
        sub: user.sub,
      },
    });

    if (!userEntity) {
      throw new TranslatedException(
        DatabaseErrors.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    return await this.userTransformer.toJson(userEntity);
  }
}
