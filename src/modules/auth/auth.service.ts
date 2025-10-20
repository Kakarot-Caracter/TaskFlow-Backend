import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { Response } from 'express';

//Services
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from '../user/user.service';

//Dtos
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

//Interfaces
import { Jwtpayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async register(dto: CreateUserDto, res: Response) {
    const user = await this.userService.createUser(dto);

    const token = this.signToken({ id: user.id });

    this.setCookie(res, token);

    return user;
  }

  async login(dto: LoginUserDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('Usuario no registrado.');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña inválida.');

    const token = this.signToken({ id: user.id });
    this.setCookie(res, token);

    return { id: user.id, name: user.name, email: user.email };
  }

  logout(res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email no registrado');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Token inválido o expirado');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
  }

  private signToken(payload: Jwtpayload): string {
    return this.jwtService.sign(payload);
  }

  private setCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true, // Obligatorio para sameSite: 'none'
      sameSite: 'none', // Permite cookies cross-domain
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
  }
}
