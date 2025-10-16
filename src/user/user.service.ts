import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/prisma/prisma.error.handler';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(id: number) {
    return await this.prisma.user.findFirst({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });
  }
}
