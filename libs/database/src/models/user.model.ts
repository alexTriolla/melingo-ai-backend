import { IUser, IUserRole } from '@app/types';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CompanyModel } from './company.model';
/**
 * Represents a User model in the database.
 */
@Table({
  tableName: 'users',
  deletedAt: false,
  scopes: {
    idOnly: {
      attributes: ['id', 'sub'],
    },
  },
})
export class UserModel extends Model<IUser> {
  @Column({ allowNull: false, type: DataType.STRING })
  sub: string;

  @Column({
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @BelongsTo(() => CompanyModel)
  company: CompanyModel;

  @ForeignKey(() => CompanyModel)
  @Column({ allowNull: true })
  companyId: number;

  @Column({ allowNull: true, type: DataType.BOOLEAN, defaultValue: true })
  email_verified: boolean;

  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: true, type: DataType.STRING })
  lastName: string;

  @Column({ allowNull: true, type: DataType.STRING })
  datasetName: string;

  @Column({ allowNull: true, type: DataType.NUMBER, defaultValue: 0 })
  usageLimitation: number;

  @Column({ allowNull: true, type: DataType.STRING })
  welcomeEn: string;

  @Column({ allowNull: true, type: DataType.STRING })
  welcomeHe: string;

  @Column({ allowNull: false, type: DataType.STRING })
  role: IUserRole;

  @Column({ type: DataType.DATE, allowNull: true })
  lastLoginDate?: Date | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
