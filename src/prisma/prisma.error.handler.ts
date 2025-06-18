// src/common/errors/prisma-error-handler.ts
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException('A unique constraint failed.');
      case 'P2025':
        throw new NotFoundException('Record not found.');
      default:
        throw new BadRequestException('A known database error occurred.');
    }
  }

  throw new InternalServerErrorException(
    'An unexpected server error occurred.',
  );
}
