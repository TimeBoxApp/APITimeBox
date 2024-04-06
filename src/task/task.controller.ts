import { Controller, Post, Body, Patch, Param, Delete, Req, Get, Query } from '@nestjs/common';

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRequest } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Req() request: UserRequest, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(request.user.userId, createTaskDto);
  }

  @Get(':id')
  async findOne(@Req() request: UserRequest, @Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(+id, request.user.userId);
  }

  @Get()
  async getTasksByWeek(@Req() request: UserRequest, @Query('weekId') weekId: number) {
    return this.taskService.findTasksByWeekId(+weekId, request.user.userId);
  }

  @Patch(':id')
  async update(@Req() request: UserRequest, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, request.user.userId, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Req() request: UserRequest, @Param('id') id: string) {
    return this.taskService.remove(+id, request.user.userId);
  }
}
