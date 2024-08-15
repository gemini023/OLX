import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@prisma/client';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, Length, IsBoolean } from 'class-validator';

export class SignUpDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty() 
    @IsString()
    @Length(8, 16) 
    password: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @IsString()
    @IsOptional()
    role?: UserRoles;

    @IsBoolean()
    isActive: boolean = false
}
