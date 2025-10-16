"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawHeaders = void 0;
const common_1 = require("@nestjs/common");
exports.RawHeaders = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const headers = req.rawHeaders;
    if (!headers)
        throw new common_1.InternalServerErrorException('Headers not foud');
    return headers;
});
//# sourceMappingURL=row-headers.decorator.js.map