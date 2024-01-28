import * as _ from 'lodash';
import { Not, Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { WeekService } from '../week/week.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    private readonly weekService: WeekService,

    private readonly categoryService: CategoryService
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
    const categories = [];

    if (weekId) {
      const week = await this.weekService.findWeekWithoutTasks(weekId);

      if (!week) {
        throw new NotFoundException('Week not found');
      }

      if (week.userId !== user.id) {
        throw new ForbiddenException('User cannot create task for another user');
      }

      task.weekId = weekId;
    }

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);

      if (!category) throw new NotFoundException('Category not found');

      if (category.userId != user.id) throw new ForbiddenException('User cannot use this category');

      categories.push(category);
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.userId = userId;
    task.backlogRank = backlogRank;
    task.boardRank = boardRank;
    task.categories = categories;

    if (dueDate) task.dueDate = new Date(dueDate);

    await this.taskRepository.save(task);

    return task;
  }

  // findAll() {
  //   return `This action returns all task`;
  // }

  async findOne(id: number, userId: number) {
    const task: Task | null = await this.taskRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        priority: true,
        backlogRank: true,
        boardRank: true,
        userId: true,
        categories: {
          id: true,
          title: true,
          emoji: true,
          color: true
        }
      },
      relations: { categories: true }
    });

    if (!task) throw new NotFoundException('Task not found');

    if (userId !== task.userId) throw new ForbiddenException('User cannot access this task');

    return task;
  }

  async findTasksByWeekId(weekId: number, userId: number) {
    const tasks: Task[] = await this.taskRepository.find({
      where: { weekId, userId, status: Not(TaskStatus.CREATED) },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        boardRank: true,
        categories: {
          id: true,
          title: true,
          emoji: true,
          color: true
        }
      },
      relations: { categories: true }
    });

    return { tasks: this.groupTasksByStatus(tasks) };
  }

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

    await this.taskRepository.delete({ id: taskId });

    this.logger.log(`Successfully removed task ${taskId}`);

    return { statusCode: HttpStatus.OK, message: 'OK' };
  }

  /**
   * Group tasks by status
   * @param tasks
   */
  groupTasksByStatus = (tasks: Task[]) => {
    const groupedTasks = _.groupBy(tasks, 'status');

    for (const status in groupedTasks) {
      groupedTasks[status] = _.orderBy(groupedTasks[status], ['boardRank'], ['asc']);
    }

    return groupedTasks;
  };
}
