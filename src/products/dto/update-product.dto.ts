import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    adress?: string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty()
    @IsString()
    @IsOptional()
    status?: string;
}
