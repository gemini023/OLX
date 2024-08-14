import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/users/common/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createFavoriteDto: CreateFavoriteDto) {
    return this.prisma.favorites.create({
      data: {
        userId: createFavoriteDto.userId,
        productId: createFavoriteDto.productId,
      },
    });
  }

  async findAll() {
    return this.prisma.favorites.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: string) {
    const favorite = await this.prisma.favorites.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return favorite;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.prisma.favorites.findUnique({ where: { id } });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.favorites.update({
      where: { id },
      data: updateFavoriteDto,
    });
  }

  async remove(id: string) {
    const favorite = await this.prisma.favorites.findUnique({ where: { id } });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorites.delete({ where: { id } });

    return {
      message: 'Favorite deleted successfully',
    };
  }
}
