import { Strategy } from 'passport-jwt';
import { Jwtpayload } from '../interfaces/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: Jwtpayload): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        resetToken: string | null;
        resetTokenExpires: Date | null;
        createdAt: Date;
    } | null>;
}
export {};
