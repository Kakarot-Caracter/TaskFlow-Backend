import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from 'generated/prisma';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('user')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.userService.findFirst(user.id);
  }
}
