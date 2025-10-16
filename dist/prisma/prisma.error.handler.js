"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../generated/prisma/index.js");
function handlePrismaError(error) {
    if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                throw new common_1.BadRequestException('A unique constraint failed.');
            case 'P2025':
                throw new common_1.NotFoundException('Record not found.');
            default:
                throw new common_1.BadRequestException('A known database error occurred.');
        }
    }
    throw new common_1.InternalServerErrorException('An unexpected server error occurred.');
}
//# sourceMappingURL=prisma.error.handler.js.map