import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const PORT = process.env.PORT || 4001

  const config = new DocumentBuilder()
    .setTitle('OLX API')
    .setDescription('OLX API docs')
    .setVersion('1.0.0')
    .addTag('olx')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('rent', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}'s port.`)
  });
}
bootstrap();
