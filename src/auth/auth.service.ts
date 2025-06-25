// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { Response } from 'express';
import { User } from 'generated/prisma';
import { Jwtpayload } from './interfaces/jwt.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: CreateUserDto, res: Response): Promise<{ user: User }> {
    const isExist = await this.prisma.user.findUnique({
      where: { email: dto.email, name: dto.name },
    });
    if (isExist)
      throw new BadRequestException(
        'Ya estás autenticado, no puedes registrarte nuevamente',
      );

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashed,
      },
    });

    const token = this.signToken({ id: user.id });

    this.setCookie(res, token);

    return { user };
  }

  async login(dto: LoginUserDto, res: Response): Promise<{ user: User }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Contraseña inválida');

    const token = this.signToken({ id: user.id });
    this.setCookie(res, token);

    return { user };
  }

  logout(res: Response): void {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
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
      secure: true, // Debe ser true en producción
      sameSite: 'none', // Necesario para cross-site
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
      domain: 'taskflow-backend-production-6b16.up.railway.app',
    });
  }
}
