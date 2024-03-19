import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasOne,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { Company } from '@app/types';

/**
 * Represents a Company model in the database.
 */
@Table({
  tableName: 'companies',
})
export class CompanyModel extends Model<Company> {
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  businessName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isEmail: true },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Assuming phone is optional
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Assuming fax is optional
  })
  fax: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  displayLinks: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  linkWithPicture: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotPosition: string; // "left" or "right"

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotSubtitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  themeColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  fontColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  buttonColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  backgroundPattern: string; // Can be hex color or URL to an S3 object

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string; // URL to an S3 object

  @HasOne(() => UserModel)
  user: UserModel;
}
