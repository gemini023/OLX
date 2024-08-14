import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class OtpDto {
    @ApiProperty()
    @IsNumber()
    otp: number

    @ApiProperty()
    @IsString()
    userId: string
}