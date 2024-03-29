import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SettingsModule } from './settings.module';
import { configuration, validationPipe } from '@app/common';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(SettingsModule);
  
  app.use(express.json());

  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix(`v${configuration().apiVersion}`);

  if (configuration().development) {
    const config = new DocumentBuilder()
      .setTitle('Melingo AI Users API')
      .addBearerAuth()
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(configuration().port);

  Logger.debug(`Server is running on ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
