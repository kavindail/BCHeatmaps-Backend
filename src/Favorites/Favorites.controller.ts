import {
  Get,
  Body,
  Controller,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './Favorites.service';
import { Request, Response } from 'express';
import * as cookie from 'cookie';

type Favorite = {
  latitude: Number;
  longitude: Number;
  zoomLevel: Number;
};

@Controller('favorite')
export class FavoritesController {
  constructor(private favoriteService: FavoriteService) {}

  @Post()
  async addFavorite(@Body() favorite: Favorite, @Res() res: Response) {}

  @Get()
  async getFavorites(@Req() req: Request, @Res() res: Response) {
    //TODO: Return all of a users favorites
    // The user ID is in the decoded jwt token
    console.log('GET made to /favorites');
    const cookies = cookie.parse(req.headers.cookie || '');
    const jwtToken = cookies['token'];

    if (!jwtToken) {
      return res.status(401).json({ message: 'No jwt token provided' });
    }
  }
}
