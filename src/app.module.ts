import { Module } from '@nestjs/common';
import { PrismaService } from './users/common/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './users/common/mailer/mailer.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    FavoritesModule,
    MessagesModule,
    ReviewsModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
