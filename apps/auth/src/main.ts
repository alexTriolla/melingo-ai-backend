import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { configuration, validationPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('configuration', configuration().port);

  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix(`v${configuration().apiVersion}`);

  if (configuration().development) {
    const config = new DocumentBuilder()
      .setTitle('Melingo AI Authentication API')
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
