import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/users/common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.reviews.create({
      data: {
        userId: createReviewDto.userId,
        productId: createReviewDto.productId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
    });
  }

  async findAll() {
    return this.prisma.reviews.findMany({
      include: {
        user: true,
        product: true,
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.reviews.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.reviews.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    const review = await this.prisma.reviews.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.reviews.delete({ where: { id } });

    return {
      message: 'Review deleted successfully',
    };
  }
}
