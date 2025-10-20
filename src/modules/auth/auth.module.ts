import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

//Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

//Constrollers
import { AuthController } from './auth.controller';

//Services
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') || 'OneBigSecret',
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [UserService, JwtStrategy, AuthService, MailService],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
