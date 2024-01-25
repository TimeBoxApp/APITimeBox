import { Controller, Post, Body, Patch, Param, Delete, Req, Get, Query } from '@nestjs/common';

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRequest } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,

    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Req() request: UserRequest, @Body() createTaskDto: CreateTaskDto) {
    const user = await this.userService.getUserForRequest(request);

    return this.taskService.create(user, createTaskDto);
  }

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  @Get(':id')
  async findOne(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);

    return this.taskService.findOne(+id, user.id);
  }

  @Get()
  async getTasksByWeek(@Req() request: UserRequest, @Query('weekId') weekId: number) {
    const user = await this.userService.getUserForRequest(request);

    return this.taskService.findTasksByWeekId(+weekId, user.id);
  }

  @Patch(':id')
  async update(@Req() request: UserRequest, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const user = await this.userService.getUserForRequest(request);

    return this.taskService.update(+id, user.id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);

    return this.taskService.remove(+id, user.id);
  }
}
