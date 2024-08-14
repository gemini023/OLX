import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    senderId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}
