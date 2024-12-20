import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './Favorites.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

type favoriteDto = {
  latitude: Float32Array;
  longitude: Float32Array;
  zoomLevel: Float32Array;
};

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async insertFavoriteForUser(favorite: favoriteDto, jwtToken: string) {
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

      const favoriteEntity = this.favoriteRepository.create({
        ...favorite,
        userID: userID,
      });

      console.log('Adding favorite', favoriteEntity);
      const savedFavorite = await this.favoriteRepository.save(favoriteEntity);
      console.log('Favorite added: ', savedFavorite);

      if (!savedFavorite) {
        console.log('Error inserting favorite');
        return null;
      }

      return savedFavorite;
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

      const favorites = await this.favoriteRepository.find({
        where: { userID: userID },
      });

      console.log('favorites, ', favorites);
      return favorites;
    } catch (error) {
      console.log('Error getting favorites for user: ' + error);
      return null;
    }
  }
}
