import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  ValidateIf,
  IsInt,
} from 'class-validator';

export class UpdateCompanyDTO {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsOptional()
  @IsBoolean()
  displayLinks?: boolean;

  @IsOptional()
  @IsBoolean()
  linkWithPicture?: boolean;

  @IsOptional()
  @IsString()
  chatbotPosition?: string;

  @IsOptional()
  @IsString()
  chatbotName?: string;

  @IsOptional()
  @IsString()
  chatbotSubtitle?: string;

  @IsOptional()
  @IsString()
  themeColor?: string;

  @IsOptional()
  @IsString()
  fontColor?: string;

  @IsOptional()
  @IsString()
  buttonColor?: string;

  @IsOptional()
  @IsString()
  backgroundPattern?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
