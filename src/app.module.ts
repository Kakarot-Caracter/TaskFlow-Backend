import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, AuthModule, TaskModule, MailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
