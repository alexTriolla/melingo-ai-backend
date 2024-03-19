import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import {
  BaseRepository,
  CompanyModel,
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
export class SettingsService {
  repository: BaseRepository<CompanyModel>;

  constructor(
    @InjectModel(CompanyModel)
    private companyRepo: typeof CompanyModel,
    private cognitoService: CognitoService
  ) {
    this.repository = new BaseRepository<CompanyModel>(companyRepo);
  }
}
