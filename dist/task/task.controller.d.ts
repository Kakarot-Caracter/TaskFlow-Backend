import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'generated/prisma';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(createTaskDto: CreateTaskDto, user: User): Promise<{
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
    findAll(user: User): Promise<{
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
    update(id: number, user: User, updateTaskDto: UpdateTaskDto): Promise<{
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
    remove(id: number, user: User): Promise<{
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
