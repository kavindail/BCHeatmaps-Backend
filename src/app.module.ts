import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityPointsModule } from './ActivityPoints/ActivityPoints.module';

@Module({
  imports: [ActivityPointsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
