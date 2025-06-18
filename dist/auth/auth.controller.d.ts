import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    constructor(authService: AuthService, mailService: MailService);
    register(dto: CreateUserDto, res: Response): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            createdAt: Date;
        };
    }>;
    login(dto: LoginUserDto, res: Response): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            resetToken: string | null;
            resetTokenExpires: Date | null;
            createdAt: Date;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    forgot(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
