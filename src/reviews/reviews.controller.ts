import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/users/common/guards/role.guard';
import { Roles } from 'src/users/common/guards/roles.decorator';
import { JwtAuthGuard } from 'src/users/common/jwt/jwt-guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Reviews")
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Roles("admin", "user")
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Roles("admin", "user")
  @Get()
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Roles("admin", "user")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }
  
  @Roles("admin")
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Roles("admin")
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
