import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Jwtpayload } from '../interfaces/jwt.payload';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService, // <- también con readonly
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET') || 'xiomara',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.auth_token,
      ]),
    });
  }

  async validate(payload: Jwtpayload) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });

    return user;
  }
}
