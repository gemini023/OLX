import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/users/common/prisma/prisma.service';
import { MailService } from './common/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailService, JwtService],
})
export class UsersModule {}
