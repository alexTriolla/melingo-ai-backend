import { Injectable } from '@nestjs/common';
import { BaseTransformer } from './base.transformer';
import { IUser } from '@app/types';
import { UserModel, CompanyModel } from '../models';

@Injectable()
export class UserTransformer extends BaseTransformer<UserModel> {
  constructor() {
    super();
  }

  async toJson(user: UserModel): Promise<IUser> {
    let companyDetails = null;
    const company: CompanyModel | null = user.company;

    if (company) {
      companyDetails = {
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        businessName: company.businessName,
        email: company.email,
        phone: company.phone,
        fax: company.fax,
        displayLinks: company.displayLinks,
        linkWithPicture: company.linkWithPicture,
        chatbotPosition: company.chatbotPosition,
        chatbotName: company.chatbotName,
        chatbotSubtitle: company.chatbotSubtitle,
        themeColor: company.themeColor,
        fontColor: company.fontColor,
        buttonColor: company.buttonColor,
        backgroundPattern: company.backgroundPattern,
        logo: company.logo,
      };
    }

    return {
      ...user.get(),
      company: companyDetails,
    };
  }
}
