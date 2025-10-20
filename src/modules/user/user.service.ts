import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findFirst(id: number) {
    return await this.prisma.user.findFirst({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }
}
