import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove campos que não estão no DTO
    forbidNonWhitelisted: true, // não permite campos que não estão no DTO
    transform: true, // transforma os campos para o tipo especificado
  }));
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
