import { Model } from 'sequelize-typescript';

export abstract class BaseTransformer<T extends Model> {
  async transform(rows: T[] | T | null, timestamps = true): Promise<any> {
    if (!rows) {
      return null;
    }

    if (Array.isArray(rows)) {
      return await Promise.all(rows.map(async (item) => await this.toJson(item, timestamps)));
    }

    return await this.toJson(rows, timestamps);
  }

  abstract toJson(item: T, timestamps?: boolean): Promise<object>;
}
