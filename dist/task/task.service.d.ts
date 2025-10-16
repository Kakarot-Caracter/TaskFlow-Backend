import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TaskService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTaskDto: CreateTaskDto, userId: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: import("generated/prisma").$Enums.Priority;
        category: string;
        dueDate: Date;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: import("generated/prisma").$Enums.Priority;
        category: string;
        dueDate: Date;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }[]>;
    update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: import("generated/prisma").$Enums.Priority;
        category: string;
        dueDate: Date;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        priority: import("generated/prisma").$Enums.Priority;
        category: string;
        dueDate: Date;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
}
