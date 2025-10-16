import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(id: number): Promise<{
        name: string;
        email: string;
    } | null>;
}
