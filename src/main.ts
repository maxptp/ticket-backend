import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด field แปลกๆ ที่ไม่ได้อยู่ใน DTO
      forbidNonWhitelisted: true, // ถ้ามี field เกิน -> error
      transform: true, // แปลง query string → number, enum, etc
      errorHttpStatusCode: 422, // validation error → 422 Unprocessable Entity
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
