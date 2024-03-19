import { DynamicModule, Global, Module } from '@nestjs/common';
import * as path from 'path';

import { I18nOptionResolver, I18nModule as NestI18nModule } from 'nestjs-i18n';
import { cwd } from 'process';
import { LangService } from './lang.service';

@Global()
@Module({})
export class I18nModule {
  static forRoot(resolvers: I18nOptionResolver[]): DynamicModule {
    return {
      module: I18nModule,
      imports: [
        NestI18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(cwd(), '/libs/i18n/src/locales/'),
            watch: true,
          },
          typesOutputPath: path.join(cwd(), '/libs/i18n/src/i18n.generated.ts'),

          resolvers: resolvers,
        }),
      ],
      providers: [LangService],
      exports: [LangService],
    };
  }
}
