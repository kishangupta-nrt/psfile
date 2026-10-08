import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map((s) => s.trim());
  app.enableCors({ origin: corsOrigin, credentials: true });
  const config = new DocumentBuilder()
    .setTitle('NRT-SMS Clone API')
    .setDescription('NestJS rebuild of app.ok-go.in (non-DLT). Legacy base https://ok-go.in/api/ mapped to /api/v1.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
}
bootstrap();
