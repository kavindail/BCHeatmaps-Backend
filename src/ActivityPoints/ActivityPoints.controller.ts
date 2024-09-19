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

@Controller('activityPoints')
export class ActivityPointsController {
  // constructor(private readonly authService: AuthService) {}

  @Get()
  async getActivityPoints(@Res() res: Response) {
    console.log('Getting all assesments');
    let activityPoints = 'testing api call';

    return res.status(HttpStatus.OK).json(activityPoints);
  }
}
