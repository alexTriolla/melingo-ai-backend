import { NestFactory } from '@nestjs/core';
import { SettingsModule } from './settings.module';

async function bootstrap() {
  const app = await NestFactory.create(SettingsModule);
  await app.listen(3000);
}
bootstrap();
