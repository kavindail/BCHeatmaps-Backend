import {
  Controller,
  Query,
  Put,
  Delete,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ActivityPointsService } from './ActivityPoints.service';

@Controller('activityPoints')
export class ActivityPointsController {
  constructor(private readonly activityPointsService: ActivityPointsService) {}

  @Get()
  async getActivityPoints(@Res() res: Response) {
    console.log('Testing api call');
    let activityPoints = await this.activityPointsService.findAll();

    return res.status(HttpStatus.OK).json(activityPoints);
  }

  @Post()
  async createActivityPoints(
    @Body() activityPoints: any,
    @Res() res: Response,
  ) {
    try {
      const points = await this.activityPointsService.create(activityPoints);
      if (!points) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Failed to save activity points to database' });
      }
      return res.status(HttpStatus.CREATED).json(points);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @Get('/getJson')
  async getJsonData(@Res() res: Response) {
    try {
      const jsonData = this.activityPointsService.getActivityFromJson();
      if (!jsonData) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Failed to parse json data' });
      }
      return res.status(HttpStatus.CREATED).json(jsonData);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
