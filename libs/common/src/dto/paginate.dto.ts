import { OrderDir } from '@app/database';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class PaginateRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  per_page: number;

  @IsOptional()
  @IsString()
  order_by: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order_dir: OrderDir;

  @IsOptional()
  search: string | null;

  @IsOptional()
  @IsArray()
  fields: Array<string> | null;

  @IsOptional()
  @IsArray()
  filter_key: Array<string> | null;

  @IsOptional()
  @IsArray()
  filter_value: Array<string> | null;

  @IsOptional()
  @IsString()
  include: string | null;

  @IsOptional()
  @IsIn(['1', '0'])
  withTrashed: string | null;
}
