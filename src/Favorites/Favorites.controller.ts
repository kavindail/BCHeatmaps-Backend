import {
  Get,
  Body,
  Controller,
  Post,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './Favorites.service';
import { Request, Response } from 'express';
import * as cookie from 'cookie';

type favoriteDto = {
  latitude: Float32Array;
  longitude: Float32Array;
  zoomLevel: Float32Array;
};

@Controller('favorite')
export class FavoritesController {
  constructor(private favoriteService: FavoriteService) {}

  @Post()
  async addFavorite(
    @Req() req: Request,
    @Body() favorite: favoriteDto,
    @Res() res: Response,
  ) {
    console.log('POST made to /favorites');
    const cookies = cookie.parse(req.headers.cookie || '');
    const jwtToken = cookies['token'];

    if (!jwtToken) {
      return res.status(401).json({ message: 'No jwt token provided' });
    }

    const added = this.favoriteService.insertFavoriteForUser(
      favorite,
      jwtToken,
    );

    if (added) {
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Favorite added correctly' });
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Favorite not added' });
    }
  }

  @Get()
  async getFavorites(@Req() req: Request, @Res() res: Response) {
    console.log('GET made to /favorites');
    const cookies = cookie.parse(req.headers.cookie || '');
    const jwtToken = cookies['token'];

    const favorites = await this.favoriteService.getFavoritesForUser(jwtToken);

    if (!jwtToken) {
      return res.status(401).json({ message: 'No jwt token provided' });
    }

    if (favorites) {
      return res.status(HttpStatus.OK).json({ favorites });
    } else {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Error retrieving favorites' });
    }
  }
}
