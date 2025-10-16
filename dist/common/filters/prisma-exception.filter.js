"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../../generated/prisma/index.js");
let PrismaClientExceptionFilter = class PrismaClientExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = 400;
        let message = 'Error de base de datos';
        switch (exception.code) {
            case 'P2002':
                status = 400;
                const fields = Array.isArray(exception.meta?.target)
                    ? exception.meta.target.join(', ')
                    : '';
                message = `El campo ${fields} ya está en uso.`;
                break;
            case 'P2025':
                status = 404;
                message = 'Registro no encontrado.';
                break;
            default:
                status = 400;
                message = 'Error conocido de base de datos.';
        }
        response.status(status).json({ statusCode: status, message });
    }
};
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter = __decorate([
    (0, common_1.Catch)(prisma_1.Prisma.PrismaClientKnownRequestError)
], PrismaClientExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map