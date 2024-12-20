import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './Favorites.entity';
import { FavoritesController } from './Favorites.controller';
import { FavoriteService } from './Favorites.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), AuthModule],
  controllers: [FavoritesController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoritesModule {}
