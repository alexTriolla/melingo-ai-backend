import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HeaderResolver } from 'nestjs-i18n';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';

import { ConfigModule } from '@nestjs/config';
import { AwsModule } from '@app/aws';
import { I18nModule } from '@app/i18n';

import { AllExceptionsFilter, configuration } from '@app/common';
import { SettingsController } from './settings.controller';
import { CompanyModel, DatabaseModule, UserModel } from '@app/database';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    DatabaseModule.forRoot([CompanyModel, UserModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [join(process.cwd(), 'apps/settings/.env')],
    }),
    I18nModule.forRoot([new HeaderResolver(['lang'])]),
    AwsModule.forRoot({
      userPoolId: configuration().userPoolId,
      clientId: configuration().clientId,
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    SettingsService,
  ],
  controllers: [SettingsController],
})
export class SettingsModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
