import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { Response } from 'express';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    register(dto: CreateUserDto, res: Response): Promise<{
        user: User;
    }>;
    login(dto: LoginUserDto, res: Response): Promise<{
        user: User;
    }>;
    logout(res: Response): void;
    generateResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    private signToken;
    private setCookie;
}
