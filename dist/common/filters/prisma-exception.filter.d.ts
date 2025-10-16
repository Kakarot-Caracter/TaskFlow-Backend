import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
export declare class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
