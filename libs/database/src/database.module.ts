import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { configuration } from '@app/common';
import { UserTransformer } from './transformers';

/**
 * Represents a module for configuring and initializing the database connection.
 * @remarks
 * This module is responsible for setting up the Sequelize ORM and connecting to the PostgreSQL database.
 * @public
 */
@Global()
@Module({})
export class DatabaseModule {
  /**
   * Creates a database module for the root application module asynchronously.
   * @param models - The Sequelize models to be used by the application.
   * @returns The configured database module for the root application module.
   */
  static forRoot(models: ModelCtor[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        SequelizeModule.forRootAsync({
          useFactory: () => ({
            dialect: 'postgres',
            uri: configuration().databaseUrl,
            models: models,
            logging(sql: string) {
              //  Log all SQL queries to the console in development mode
              if (configuration().development) {
                Logger.log(sql, 'Sequelize');
              }
            },
            logQueryParameters: true,
          }),
        }),
        SequelizeModule.forFeature(models),
      ],
      providers: [UserTransformer],
      exports: [SequelizeModule, UserTransformer],
    };
  }
}
