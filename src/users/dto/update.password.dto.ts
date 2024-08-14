import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    old_password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    new_password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    confirmNew_password: string
}