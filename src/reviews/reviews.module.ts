import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from 'src/users/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService, JwtService],
})
export class ReviewsModule {}
