import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(dto, res);
    return { message: 'Registro exitoso', user };
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto, res);
    return { message: 'Login exitoso', user };
  }

  @Post('logout')
  @Auth()
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);
    return { message: 'Logout exitoso' };
  }

  @Post('forgot-password')
  async forgot(@Body() dto: ForgotPasswordDto) {
    const token = await this.authService.generateResetToken(dto.email);
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(dto.email, link);
    return { message: 'Email de reseteo enviado' };
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Contraseña actualizada correctamente' };
  }
}
