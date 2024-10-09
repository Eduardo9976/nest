import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {ValidationPipe} from "@nestjs/common";
import {MyExceptionFilter} from "./common/filters/my-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove campos que não estão no DTO
    forbidNonWhitelisted: true, // não permite campos que não estão no DTO
    transform: true, // transforma os campos para o tipo especificado
  }));
  app.setGlobalPrefix('api');

  // fiz no modulo global (app) para nao precisa usar o new e conseguir ter a injecao de dependencia, poderia usar para guards, pipe,etc...
  // app.useGlobalFilters(new MyExceptionFilter());

  await app.listen(3000);
}
bootstrap();
