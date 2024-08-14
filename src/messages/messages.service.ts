import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/users/common/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.messages.create({
      data: {
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
        productId: createMessageDto.productId,
        content: createMessageDto.content,
      },
    });
  }

  async findAll() {
    return this.prisma.messages.findMany({
      include: {
        sender: true,
        receiver: true,
        product: true,
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.messages.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        product: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.prisma.messages.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.messages.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: string) {
    const message = await this.prisma.messages.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.prisma.messages.delete({ where: { id } });

    return {
      message: 'Message deleted successfully',
    };
  }
}
