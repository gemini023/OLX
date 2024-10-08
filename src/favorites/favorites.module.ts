import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from 'src/users/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, JwtService],
})
export class FavoritesModule {}
