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
    let activityPoints = await this.activityPointsService.findAll();
    console.log(activityPoints);

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

  @Post('/activeCoordinates')
  async recalculateJsonActivityPoints(@Res() res: Response) {
    const fullJson = await this.activityPointsService.getActivityFromJson();
    return res.status(HttpStatus.CREATED).json(fullJson);
  }

  @Delete()
  async clearPointData(@Res() res: Response) {
    if (this.activityPointsService.clearDatabase()) {
      return res
        .status(HttpStatus.CREATED)
        .json('Sucesfully cleared the database');
    } else {
      return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json('Failed to clear the database');
    }
  }
}
