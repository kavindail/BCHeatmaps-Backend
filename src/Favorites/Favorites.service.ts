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

  async getFavoritesForUser(jwtToken: string) {
    //TODO: Also verify this JWT Token
    let isTokenInDB = await this.authService.verifyJWTToken(jwtToken);
    if (!isTokenInDB) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET || '{}';
    try {
      let decodedJwtToken = await this.jwtService.verify(jwtToken, {
        secret: jwtSecret,
      });

      const email = decodedJwtToken.email;
      const userID = decodedJwtToken.userID;
      const expiryTime = decodedJwtToken.exp;

      //TODO: Just return all of a users favorites based on their info here make a simple get to the db with the user specified
    } catch (error) {
      console.log('Error verifying jwt token: ' + error);
      return null;
    }
  }
}
