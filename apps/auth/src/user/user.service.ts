import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
  CompanyModel,
  DatabaseErrors,
  UserModel,
  UserTransformer,
} from '@app/database';
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
      include: [
        {
          model: CompanyModel,
          attributes: [
            'id',
            'createdAt',
            'updatedAt',
            'businessName',
            'email',
            'phone',
            'fax',
            'displayLinks',
            'linkWithPicture',
            'chatbotPosition',
            'chatbotName',
            'chatbotSubtitle',
            'themeColor',
            'fontColor',
            'buttonColor',
            'backgroundPattern',
            'logo',
          ],
        },
      ],
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
