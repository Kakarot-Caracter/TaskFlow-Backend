"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async register(dto, res) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: hashed,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        const token = this.signToken({ id: user.id });
        this.setCookie(res, token);
        return { user };
    }
    async login(dto, res) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no registrado.');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Contraseña inválida.');
        const token = this.signToken({ id: user.id });
        this.setCookie(res, token);
        return { id: user.id, name: user.name, email: user.email };
    }
    async generateResetToken(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Email no registrado');
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken: token, resetTokenExpires: expires },
        });
        return token;
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
        });
        if (!user)
            throw new common_1.BadRequestException('Token inválido o expirado');
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
    signToken(payload) {
        return this.jwtService.sign(payload);
    }
    setCookie(res, token) {
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
        });
    }
    logout(res) {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map