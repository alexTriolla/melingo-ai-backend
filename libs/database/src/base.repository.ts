import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  Attributes,
  BelongsToManyAddAssociationsMixinOptions,
  CountOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Identifier,
  Op,
  RestoreOptions,
  UpdateOptions,
  literal,
} from 'sequelize';
import { Model, Repository } from 'sequelize-typescript';
import { Col, Fn, Literal } from 'sequelize/types/utils';
import {
  AbstractRepository,
  OrderDir,
  PaginateOptions,
  PaginateResponse,
  QueryParamsOptions,
} from './abstract.repository';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { BaseTransformer } from './transformers';
import { DatabaseErrors } from './errors';
import { TranslatedException } from '@app/common';

dayjs.extend(utc);

function capitalize(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export class BaseRepository<T extends Model, IModel = any> implements AbstractRepository<T> {
  repository: Repository<T>;
  searchableFields: string[];

  constructor(repository: Repository<T>, searchableFields?: string[]) {
    this.repository = repository;
    this.searchableFields = searchableFields || [];
  }

  countAll(options?: Omit<CountOptions<Attributes<T>>, 'group'>): Promise<number> {
    return this.repository.count(options);
  }

  async create(
    values?: CreationAttributes<T>,
    attach?: any,
    options?: CreateOptions<Attributes<T>>
  ): Promise<T> {
    const model = await this.repository.create(values, options);

    if (attach) {
      for (const relation in attach) {
        await this.updateRelation(model.id, relation, attach[relation], true);
      }
    }

    return await model.reload({
      include: attach && Object.keys(attach),
    });
  }

  async findOne(
    options?: FindOptions<Attributes<T>>,
    scopes: string | string[] = 'defaultScope'
  ): Promise<T> {
    const model = await this.repository.scope(scopes).findOne(options);

    if (!model) {
      throw new NotFoundException();
    }

    return model;
  }

  async userExists(
    options?: FindOptions<Attributes<T>>,
    scopes: string | string[] = 'defaultScope'
  ): Promise<boolean> {
    const model = await this.repository.scope(scopes).findOne(options);

    if (model) {
      throw new TranslatedException(DatabaseErrors.USER_EXISTS, HttpStatus.CONFLICT);
    }

    return false;
  }

  async findById(
    identifier?: Identifier,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>,
    transformer?: BaseTransformer<T>,
    scopes: string | string[] = 'defaultScope'
  ): Promise<T> {
    const model = await this.repository.scope(scopes).findByPk(identifier, options);

    if (!model) {
      throw new NotFoundException();
    }

    return transformer ? ((await transformer.toJson(model)) as T) : model;
  }

  delete(options?: DestroyOptions<Attributes<T>>): Promise<number> {
    return this.repository.destroy(options);
  }

  restore(options?: RestoreOptions<Attributes<T>>): Promise<void> {
    return this.repository.restore(options);
  }

  update(
    values: {
      [key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
    },
    options: UpdateOptions<Attributes<T>>
  ): Promise<[affectedCount: number]> {
    return this.repository.update(values, options);
  }

  async updateById(
    id: number,
    values: {
      [key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
    },
    relations?: any
  ): Promise<T> {
    const model = await this.findById(id);

    for (const relation in relations) {
      await model[relation].update(relations[relation]);
    }

    const res = model.update(values);

    return res;
  }

  async getAll(
    options?: QueryParamsOptions,
    transformer?: BaseTransformer<T>
  ): Promise<PaginateResponse<T>> {
    const rows = await this.repository.findAll(this.buildQuery(options || {}));
    const count = rows.length;

    return {
      rows: transformer ? await transformer.transform(rows) : rows,
      meta: {
        count: count,
        total: count,
        perPage: count,
        currentPage: 1,
        totalPages: 1,
      },
    };
  }

  async paginateResults(
    data: { rows: T[]; count: number },
    perPage: number,
    currentPage: number,
    transformer: BaseTransformer<T>
  ): Promise<PaginateResponse<T | IModel>> {
    const { rows, count } = data;

    return {
      rows: await transformer.transform(rows),
      meta: {
        count: rows.length,
        total: count,
        perPage: perPage,
        currentPage: currentPage,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  async paginate(
    options?: PaginateOptions,
    transformer?: BaseTransformer<T>,
    scopes: string | string[] = 'defaultScope'
  ): Promise<PaginateResponse<T | IModel>> {
    const perPage = options.perPage || 10;
    const page = options.page || 1;
    const offset = (page - 1) * perPage;

    const { rows, count } = await this.repository.scope(scopes).findAndCountAll({
      ...this.buildQuery(options),
      offset: offset,
      limit: options.perPage,
      ...(options.rawOrder ? { order: options.rawOrder } : {}),
    });

    return {
      rows: transformer ? await transformer.transform(rows) : rows,
      meta: {
        count: rows.length,
        total: count,
        perPage: options.perPage,
        currentPage: page,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  async getRelation(id: number, relation: any, fields?: string[]) {
    // const model = await this.findById(
    //   id,
    //   {
    //     attributes: ['id'],
    //   },
    //   [],
    // );

    // return await model[`get${capitalize(relation)}`]({
    //   attributes: fields,
    // });

    const model = await this.findById(id, {
      attributes: [],
      include: [
        {
          association: relation,
          attributes: fields,
          // through: {
          //   as: 'relation',
          // },
        },
      ],
    });

    return model && model[relation];
  }

  async updateRelation(id: number, relation: string, data: any[], newModel?: boolean) {
    const model = await this.findById(id, { attributes: ['id'] });

    relation = capitalize(relation);

    if (!newModel) {
      await model[`set${relation}`]([]);
    }

    for (const item of data) {
      const { id, ...values } = item;

      await model[`add${relation}`](id || item, {
        through: values,
      } as BelongsToManyAddAssociationsMixinOptions);
    }

    return data.length;
  }

  async deleteRelation(id: number, relation: string, relId: number) {
    const model = await this.findById(id, { attributes: ['id'] });
    return await model[`remove${capitalize(relation)}`](relId);
  }

  getFieldTypeByKey(key: string): string | null {
    const attributes = this.repository.getAttributes();

    if (attributes && attributes[key]) {
      return attributes[key].type.valueOf().toString();
    }

    return null;
  }

  getSearchableFields() {
    const attributes = this.repository.getAttributes();

    return Object.keys(attributes)
      .filter((key) => {
        const type = attributes[key].type.valueOf().toString();

        return !type.includes('TIMESTAMP') && !attributes[key].autoIncrement;
      })
      .map((key) => attributes[key].field);
  }

  private buildQuery({
    withTrashed,
    orderBy,
    orderDir,
    search,
    fields,
    include,
    filter_key,
    filter_value,
  }: QueryParamsOptions): FindAndCountOptions {
    const filterConditions =
      filter_key && filter_value
        ? filter_key.map((key, index) => {
            const fieldType = this.getFieldTypeByKey(key);

            if (!fieldType) {
              return null;
            }

            return fieldType.includes('TIMESTAMP')
              ? {
                  [Op.and]: [
                    literal(
                      `DATE("${key}") = '${dayjs(filter_value[index]).format('YYYY-MM-DD')}'`
                    ),
                  ],
                }
              : {
                  [Op.and]: fieldType.includes('ENUM')
                    ? { [key]: filter_value[index] }
                    : [literal(`"${key}"::text ILIKE '%${filter_value[index]}%'`)],
                };
          })
        : [];

    return {
      paranoid: !withTrashed,
      ...(orderBy && {
        order: [[orderBy, orderDir || OrderDir.ASC]],
      }),
      where: {
        ...(filterConditions.length && { [Op.and]: filterConditions }),
        ...(search && {
          [Op.or]: this.getSearchableFields().map((field) => ({
            [field]: {
              [Op.and]: [literal(`"${field}"::text ILIKE '%${search}%'`)],
            },
          })),
        }),
      },
      attributes: fields,
      include,
    };
  }
}
