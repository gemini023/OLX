import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { OtpDto } from './dto/otp.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.signUp(signUpDto);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() otpDto: OtpDto) {
    return this.usersService.verifyOtp(otpDto);
  }

  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.usersService.refreshToken(refreshToken);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(updatePasswordDto);
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.usersService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get('getMe')
  async getMe(@Query('userId') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Get('logOut')
  async logOut(@Query('userId') userId: string) {
    return this.usersService.logOut(userId);
  }

  @Get()
  async findAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @ApiProperty({ type: UpdateUserDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':username')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
