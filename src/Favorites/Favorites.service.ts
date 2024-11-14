import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './Favorites.entity';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as fs from 'fs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async insertFavoriteForUser(jwtToken: string) {
    const isTokenInDB = await this.authService.verifyJWTToken(jwtToken);
    if (!isTokenInDB) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET || '{}';
    try {
      const decodedJwtToken = await this.jwtService.verify(jwtToken, {
        secret: jwtSecret,
      });

      if (!decodedJwtToken) {
        console.log('Error verifying jwt token');
        return null;
      }

      const userID = decodedJwtToken.userID;

      const user = await this.favoriteRepository.find({
        where: { userID: userID },
      });
    } catch (error) {
      console.log('Error inserting favorites for user: ' + error);
      return null;
    }
  }

  async getFavoritesForUser(jwtToken: string) {
    const isTokenInDB = await this.authService.verifyJWTToken(jwtToken);
    if (!isTokenInDB) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET || '{}';
    try {
      const decodedJwtToken = await this.jwtService.verify(jwtToken, {
        secret: jwtSecret,
      });
      if (!decodedJwtToken) {
        console.log('Error verifying jwt token');
        return null;
      }

      const userID = decodedJwtToken.userID;

      return await this.favoriteRepository.find({
        where: { userID: userID },
      });
    } catch (error) {
      console.log('Error getting favorites for user: ' + error);
      return null;
    }
  }
}
