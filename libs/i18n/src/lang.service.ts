import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';
import { I18nTranslations } from './i18n.generated';

@Injectable()
export class LangService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  t(key: PathImpl2<I18nTranslations>, options?: TranslateOptions): string {
    return this.i18n.t(key, {
      ...options,
      lang: I18nContext.current().lang,
    });
  }
}
