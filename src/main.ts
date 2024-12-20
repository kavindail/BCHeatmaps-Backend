import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

//TODO: Create an error log and save all variables there instead of console logging
async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(3000);
}

bootstrap();
