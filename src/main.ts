import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import AuthMiddleware from './common/middlewares/auth.middleware';
import { Logger, NestApplicationOptions } from '@nestjs/common';

async function bootstrap() {
  const options = {
    logger: process.env.NODE_ENV !== 'development'
      ? ['error', 'verbose']
      : ['error', 'verbose', 'warn', 'debug'],
  } as NestApplicationOptions;
  
  const app = await NestFactory.create(AppModule, options);
  
  app.use(express.json());
  app.use(AuthMiddleware);

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, () => {
    new Logger().verbose(`Aplications started on port '${port}'`, '+');
  });
}
bootstrap();
