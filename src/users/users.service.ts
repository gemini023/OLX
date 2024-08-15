import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/users/common/prisma/prisma.service';
import { MailService } from './common/mailer/mailer.service';
import * as otpGenerator from "otp-generator"
import * as bcrypt from "bcrypt"
import { OtpDto } from './dto/otp.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) { }

  async generateOtp(length: number = 6): Promise<number> {
    return otpGenerator.generate(length, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signUp(signUpDto: SignUpDto) {
    const { fullName, email, phoneNumber, password, } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 13);

    const newUser = await this.prisma.users.create({
      data: {
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
      }
    });

    const otp = await this.generateOtp(5)

    await this.prisma.otps.create({
      data: {
        otp: +otp,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000)
      }
    })

    await this.mailService.sendMail(
      email,
      "Verification code!",
      `Here is your ${otp} code.`,
    )

    return {
      message: "User created and OTP send to email.",
      userId: newUser.id
    }
  }


  async verifyOtp(otpDto: OtpDto) {
    const userOtp = await this.prisma.otps.findFirst({
      where: {
        userId: otpDto.userId,
        otp: otpDto.otp,
        expiresAt: { gt: new Date() }
      }
    })

    if (!userOtp) {
      throw new UnauthorizedException("User with current ID is not registered.")
    }

    if (userOtp.otp !== otpDto.otp) {
      throw new BadRequestException("Invalid OTP!")
    }


    await this.prisma.users.updateMany({
      where: { id: userOtp.userId },
      data: {
        isActive: true,
      }
    })

    await this.prisma.otps.delete({ where: { id: userOtp.id } })

    return {
      message: "User successfully verified!"
    }

  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.prisma.users.findUnique({
      where: { email: signInDto.email }
    })

    if (!user) {
      throw new NotFoundException("Invalid email or password!")
    }

    if (user.isActive !== true) {
      throw new UnauthorizedException("User is not verified!")
    }


    const passwordCompare = await bcrypt.compare(signInDto.password, user.password)
    if (!passwordCompare) {
      throw new UnauthorizedException("Invalid email or password!")
    }

    const payload = { email: user.email, sub: user.id, role : user.role }
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    await this.prisma.refreshtokens.deleteMany({
      where: { userId: user.id }
    })

    await this.prisma.refreshtokens.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 1000)
      }
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { token } = refreshTokenDto

    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET
    })

    const storedToken = await this.prisma.refreshtokens.findFirst({
      where: {
        userId: decodedToken.sub,
        token: token
      }
    })

    if (!storedToken)
      throw new UnauthorizedException("Invalid refresh token!")

    const user = await this.prisma.users.findUnique({
      where: { id: decodedToken.sub }
    })

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const payload = { email: user.email, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    await this.prisma.refreshtokens.update(({
      where: { id: storedToken.id },
      data: { token: newRefreshToken }
    }))

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }

  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { old_password, new_password, confirmNew_password, id } = updatePasswordDto

    if (!id) {
      throw new BadRequestException("User ID is required.");
    }

    const user = await this.prisma.users.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException("User not found.")
    }

    const comparePassword = await bcrypt.compare(old_password, user.password)
    if (!comparePassword) {
      throw new BadRequestException("Invalid old password.")
    }

    if (new_password !== confirmNew_password) {
      throw new BadRequestException("New password and confirm password do not match.")
    }

    const createNewPassword = await bcrypt.hash(new_password, 13)

    await this.prisma.users.update({
      where: { id: id },
      data: { password: createNewPassword }
    })

    return { message: "Password successfully updated." }

  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;

    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email not found.');
    }

    const otpNumber = await this.generateOtp(5)
    const otp = otpNumber.toString()
    const hashedOtp = await bcrypt.hash(otp, 13);

    await this.prisma.otps.create({
      data: {
        otp: otpNumber,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await this.mailService.sendMail(
      email,
      'Password Reset Request',
      `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`,
    );

    return {
      message: 'OTP sent to your email.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { otp, newPassword, userId } = resetPasswordDto;

    const userOtp = await this.prisma.otps.findFirst({
      where: { userId, expiresAt: { gt: new Date() } },
    });

    if (!userOtp) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const isOtpValid = bcrypt.compare(otp, userOtp.otp.toString());

    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.prisma.otps.delete({ where: { id: userOtp.id } });

    return {
      message: 'Password successfully reset.',
    };
  }

  async getMe(userId: string) {
    const existUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    const { password, updatedAt, createdAt, ...rest } = existUser;

    return rest;
  }

  async logOut(userId: string) {
    const existRefresh = await this.prisma.refreshtokens.findFirst({
      where: { userId },
    });

    if (!existRefresh) {
      throw new BadRequestException('Bad request');
    }

    await this.prisma.refreshtokens.delete({ where: { id: existRefresh.id } });

    return {
      message: 'Logout successfully',
      statusCode: 200,
    };
  }

  async findAllUsers() {
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        role: true
      },
    })

    if (!users) {
      throw new NotFoundException('Not Found')
    }

    return users
  }

  async findById(id: string) {
    const existUser = await this.prisma.users.findUnique({
      where: { id },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        role: true,
      },
    })
  
    if (!existUser) {
      throw new NotFoundException('Not Found')
    }
  
    return existUser
  }
  
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    })
    return user
  }

  async deleteUser(id: string) {
    const existUser = await this.prisma.users.findUnique({
      where: { id },
    });
  
    if (!existUser) {
      throw new NotFoundException('Not Found')
    }
  
    await this.prisma.users.delete({ where: { id: existUser.id } });
  
    return {
      message: 'Deleted Successfully',
      statusCode: 200,
    };
  }
  
}
