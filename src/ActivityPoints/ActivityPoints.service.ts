import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityPoints } from './ActivityPoints.entity';
import * as path from 'path';
import * as fs from 'fs';

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

  async readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState == 4 && rawFile.status == 200) {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }

  async getActivityFromJson() {
    const filePath = path.join(process.cwd(), './repliersPoints.json');
    const words = fs.readFileSync(filePath, 'utf-8').toString();
    console.log(words);
    return words;
  }
}
