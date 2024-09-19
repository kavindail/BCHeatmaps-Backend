import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityPointsController } from './ActivityPoints.controller';

@Module({
  imports: [],
  controllers: [ActivityPointsController],
  providers: [],
  exports: [],
})
export class ActivityPointsModule {}
