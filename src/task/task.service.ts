import { Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { Week } from '../week/entities/week.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Week)
    private weekRepository: Repository<Week>
  ) {}

  private readonly logger: Logger = new Logger(TaskService.name);

  async create(user: User, createTaskDto: CreateTaskDto) {
    const {
      title,
      description = null,
      status = TaskStatus.CREATED,
      dueDate = null,
      weekId,
      categoryId,
      priority = null,
      userId,
      boardRank = null,
      backlogRank = null
    } = createTaskDto;

    if (user.id !== userId) return new ForbiddenException('User cannot create task for another user');

    const task = new Task();

    if (weekId) {
      const week = await this.weekRepository.findOneBy({ id: weekId });

      if (!week) {
        throw new NotFoundException('Week not found');
      }

      if (week.userId !== user.id) {
        throw new ForbiddenException('User cannot create task for another user');
      }

      task.weekId = weekId;
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: categoryId });

      if (!category) throw new NotFoundException('Category not found');

      if (category.userId != user.id) throw new ForbiddenException('User cannot use this category');

      task.categories.push(category);
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;
    task.userId = userId;
    task.backlogRank = backlogRank;
    task.boardRank = boardRank;

    await this.taskRepository.save(task);

    return task;
  }

  // findAll() {
  //   return `This action returns all task`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const editedTask: Task | null = await this.taskRepository.findOne({
      where: { id }
    });

    if (!editedTask) throw new NotFoundException('Task not found');

    if (userId !== editedTask.userId) throw new ForbiddenException('User cannot update this task');

    await this.taskRepository.update({ id }, updateTaskDto);

    this.logger.log(`Successfully updated task ${id}`);

    return { statusCode: HttpStatus.OK, message: 'OK' };
  }

  async remove(taskId: number, userId: number) {
    const task: Task | null = await this.taskRepository.findOne({
      where: { id: taskId },
      select: {
        id: true,
        userId: true,
        categories: true
      }
    });

    if (!task) throw new NotFoundException('Task not found');

    if (userId !== task.userId) throw new ForbiddenException('User cannot delete this task');

    // await this.categoryRepository.delete({ taskId: taskId });

    await this.taskRepository.delete({ id: taskId });

    this.logger.log(`Successfully removed task ${taskId}`);

    return { statusCode: HttpStatus.OK, message: 'OK' };
  }
}
