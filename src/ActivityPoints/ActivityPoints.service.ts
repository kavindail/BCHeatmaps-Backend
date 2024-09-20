import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityPoints } from './ActivityPoints.entity';

@Injectable()
export class ActivityPointsService {
  constructor(
    @InjectRepository(ActivityPoints)
    private activityPointsRepository: Repository<ActivityPoints>,
  ) {}

  async findAll(): Promise<ActivityPoints[]> {
    return this.activityPointsRepository.find({});
  }

  async create(activityPointsData: ActivityPoints): Promise<ActivityPoints> {
    const { id, latitude, longitude } = activityPointsData;

    if (!latitude) {
      console.log('Latitude must be included');
      return;
    }

    if (!longitude) {
      console.log('Longitude must be included');
      return;
    }

    const activityPoints = this.activityPointsRepository.create({
      id,
      latitude,
      longitude,
    });
    console.log('Acitivty Points sucesfully added to db');
    return this.activityPointsRepository.save(activityPoints);
  }
}
