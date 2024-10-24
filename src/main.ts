import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Must be changed for production
  await app.listen(3000);
}
bootstrap();
