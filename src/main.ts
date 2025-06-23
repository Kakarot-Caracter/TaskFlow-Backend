import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  console.log(process.env.FRONTEND_URL);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
