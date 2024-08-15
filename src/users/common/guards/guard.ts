import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing.');
        }

        const bearerToken = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(bearerToken, { secret: process.env.JWT_ACCESS_SECRET });
            request.user = payload
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token.');
        }
    }
}