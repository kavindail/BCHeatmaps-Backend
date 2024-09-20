import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityPointsController } from './ActivityPoints.controller';
import { ActivityPointsService } from './ActivityPoints.service';
import { ActivityPoints } from './ActivityPoints.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityPoints])],
  controllers: [ActivityPointsController],
  providers: [ActivityPointsService],
  exports: [],
})
export class ActivityPointsModule {}
