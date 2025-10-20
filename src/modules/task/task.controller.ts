import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { User } from 'generated/prisma';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('task')
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return await this.taskService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.taskService.findAll(user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @GetUser() user: User,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, user.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.taskService.remove(id, user.id);
  }
}
