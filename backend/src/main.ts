import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

async function createApp() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env.FRONTEND_URL;

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: frontendUrl,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);
  console.log(`[Backend] Server is running on http://localhost:${port}`);
}

let serverlessApp: Promise<INestApplication> | undefined;

export default async function handler(request: Request, response: Response) {
  serverlessApp ??= createApp().then(async (app) => {
    await app.init();
    return app;
  });

  const app = await serverlessApp;
  const express = app.getHttpAdapter().getInstance() as (
    request: Request,
    response: Response,
  ) => void;

  return express(request, response);
}

if (process.env.VERCEL !== '1') {
  void bootstrap();
}
