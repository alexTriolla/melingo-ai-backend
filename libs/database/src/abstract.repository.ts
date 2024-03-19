import {
  Attributes,
  CountOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindOptions,
  Identifier,
  Includeable,
  Order,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';
import { Model, Repository } from 'sequelize-typescript';
import { Col, Fn, Literal } from 'sequelize/types/utils';
import { BaseTransformer } from './transformers';

export interface PaginateResponse<T> {
  rows: T[];
  meta: {
    count: number;
    total: number;
    perPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface QueryParamsOptions {
  orderBy?: string;
  orderDir?: OrderDir;
  rawOrder?: Order;
  search?: string | null;
  fields?: Array<string> | null;
  filter_key?: Array<string> | null;
  filter_value?: Array<string> | null;
  withTrashed?: boolean;
  include?: Includeable | Includeable[];
}

export interface PaginateOptions extends QueryParamsOptions {
  perPage?: number;
  page?: number;
}

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class AbstractRepository<T extends Model, IModel = any> {
  abstract repository: Repository<T>;

  abstract delete(options?: DestroyOptions<Attributes<T>>): Promise<number>;

  abstract restore(options?: RestoreOptions<Attributes<T>>): Promise<void>;

  abstract update(
    values: {
      [key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
    },
    options: UpdateOptions<Attributes<T>>
  ): Promise<[affectedCount: number]>;

  abstract updateById(
    id: number,
    values: {
      [key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
    },
    relations: any
  ): Promise<T>;

  abstract countAll(options?: Omit<CountOptions<Attributes<T>>, 'group'>): Promise<number>;

  abstract create(
    values?: CreationAttributes<T>,
    attach?: any,
    options?: CreateOptions<Attributes<T>>
  ): Promise<T>;

  abstract getAll(
    options?: PaginateOptions,
    transformer?: BaseTransformer<T>
  ): Promise<PaginateResponse<T>>;

  abstract paginateResults(
    data: { rows: T[]; count: number },
    perPage: number,
    currentPage: number,
    transformer: BaseTransformer<T>
  ): Promise<PaginateResponse<T | IModel>>;

  abstract paginate(
    options?: PaginateOptions,
    transformer?: BaseTransformer<T>,
    scopes?: string | string[]
  ): Promise<PaginateResponse<T | IModel>>;

  abstract findOne(
    options?: FindOptions<Attributes<T>>,
    scopes?: string | string[]
  ): Promise<T | null>;

  abstract findById(
    identifier?: Identifier,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>,
    transformer?: BaseTransformer<T>
  ): Promise<T>;

  abstract getRelation(identifier: Identifier, relation: string, fields?: string[]): Promise<T>;

  abstract updateRelation(
    identifier: Identifier,
    relation: string,
    data: any[],
    newModel?: boolean
  ): Promise<any>;

  abstract deleteRelation(
    identifier: Identifier,
    relation: string,
    relationsId: Identifier
  ): Promise<T>;
}
