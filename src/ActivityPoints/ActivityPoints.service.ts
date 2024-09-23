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
    const fullJson = fs.readFileSync(filePath, 'utf-8').toString();

    const activeCoords = await JSON.parse(fullJson);
    for (let i = 0; i < activeCoords.boards.length; i++) {
      let boards = activeCoords.boards[i];
      for (let j = 0; j < boards.classes.length; j++) {
        let classes = boards.classes[j];
        if (classes.name == 'residential') {
          for (let k = 0; k < classes.areas.length; k++) {
            let areas = classes.areas[k];
            for (let m = 0; m < areas.cities.length; m++) {
              let cities = areas.cities[m];
              let activeCount = cities.activeCount;
              if (cities.state == 'Ontario' && activeCount > 0) {
                for (let l = 0; l < cities.neighborhoods.length; l++) {
                  let neighborhoods = cities.neighborhoods[l];
                  console.log(neighborhoods.name);
                  const latitude = neighborhoods.location['lat'];
                  const longitude = neighborhoods.location['lng'];
                  console.log(
                    'latitude: ' + latitude + ' longitude: ' + longitude,
                  );
                }
              }
            }
          }
        }
      }
    }

    return fullJson;
  }
}
