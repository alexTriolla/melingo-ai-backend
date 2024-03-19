import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';
import { IUser, IUserRole } from '@app/types';
import { UserModel } from '../models';

@Injectable()
export class UserTransformer extends BaseTransformer<UserModel> {
  constructor() {
    super();
  }

  async toJson(item: UserModel): Promise<IUser> {
    return {
      ...item.get(),
    };
  }
}
