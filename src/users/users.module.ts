import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/users/common/prisma/prisma.service';
import { MailService } from './common/mailer/mailer.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailService, JwtService],
})
export class UsersModule { }
