import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './Favorites.entity';
import { FavoritesController } from './Favorites.controller';
import { FavoriteService } from './Favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavoritesController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoritesModule {}
