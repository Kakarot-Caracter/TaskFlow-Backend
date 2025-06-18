import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'generated/prisma';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('user')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.userService.findAll(user.id);
  }
}
