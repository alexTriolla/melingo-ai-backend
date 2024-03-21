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
import { PaginateRequestDto } from '@app/common';
import { CreateCompanyDTO } from '@app/common/dto/settings/CreateCompany.dto';
import { UpdateCompanyDTO } from '@app/common/dto/settings/UpdateCompany.dto';

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

  async list(): Promise<CompanyModel[]> {
    return await this.companyRepo.findAll();
  }

  async create(createCompanyDto: CreateCompanyDTO): Promise<CompanyModel> {
    const company = await this.companyRepo.create(createCompanyDto);
    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDTO
  ): Promise<CompanyModel> {
    return await this.repository.updateById(id, updateCompanyDto);
  }

  async delete(id: number): Promise<void> {
    const numberOfDeletedRows = await this.companyRepo.destroy({
      where: { id },
    });

    if (numberOfDeletedRows === 0) {
      throw new Error('Company not found.');
    }
  }

  async findOne(id: number): Promise<Partial<CompanyModel>> {
    const company = await this.companyRepo.findByPk(id, {
      attributes: [
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
    });

    if (!company) {
      throw new Error('Company not found.');
    }

    return company;
  }
}
