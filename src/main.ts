import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'https://task-flow-hdln05qnr-kakarotcaracters-projects.vercel.app',
      'https://task-flow-hdln05qnr-kakarotcaracters-projects.vercel.app/',
    ],
    credentials: true, // Importante si usas cookies/tokens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ⚠️ Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // ⚠️ Lanza error si llegan propiedades no permitidas
      transform: true, // ✅ Convierte tipos (ej: string a number)
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
