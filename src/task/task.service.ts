import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaError } from 'src/prisma/prisma.error.handler';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: new Date(createTaskDto.dueDate),
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.task.findMany({ where: { userId } });
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    return await this.prisma.task.update({
      where: {
        id,
        userId,
      },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.task.delete({ where: { id, userId } });
  }
}
