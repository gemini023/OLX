import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/common/guards/role.guard';
import { Roles } from 'src/users/common/guards/roles.decorator';
import { JwtAuthGuard } from 'src/users/common/jwt/jwt-guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "user")
@ApiTags("Favorites")
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  async findAll() {
    return this.favoritesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesService.update(id, updateFavoriteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
