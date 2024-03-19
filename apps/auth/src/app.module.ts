import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HeaderResolver } from 'nestjs-i18n';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AwsModule } from '@app/aws';
import { I18nModule } from '@app/i18n';
import {
  AllExceptionsFilter,
  configuration,
  AuthMiddleware,
} from '@app/common';
import { CompanyModel, DatabaseModule, UserModel } from '@app/database';
import { SettingsModule } from 'apps/settings1/src/settings.module';

@Module({
  imports: [
    DatabaseModule.forRoot([UserModel, CompanyModel]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [join(process.cwd(), 'apps/auth/.env')],
    }),
    I18nModule.forRoot([new HeaderResolver(['lang'])]),
    AwsModule.forRoot({
      userPoolId: configuration().userPoolId,
      clientId: configuration().clientId,
    }),
    UserModule,
    AuthModule,
    SettingsModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
