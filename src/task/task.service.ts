import * as _ from 'lodash';
import { IsNull, Not, Repository } from 'typeorm';
import { LexoRank } from 'lexorank';
import {
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
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

    @Inject(forwardRef(() => WeekService))
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
      priority = null,
      taskCategories,
      userId,
      boardRank = null,
      backlogRank = null
    } = createTaskDto;

    if (user.id !== userId) return new ForbiddenException('User cannot create task for another user');

    const task = new Task();

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

    if (taskCategories?.length) {
      const categoriesFound = await this.categoryService.findCategories(taskCategories, userId);

      if (!categoriesFound.length) throw new NotFoundException('Categories not found');

      task.categories = [];
      categoriesFound.forEach((cat) => task.categories.push(cat));
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.userId = userId;
    task.boardRank = boardRank;
    task.backlogRank = backlogRank;

    if (!backlogRank) {
      task.backlogRank = await this.findBacklogRank(userId, weekId);
    }

    if (!boardRank) {
      task.boardRank = await this.findBoardRank(userId, weekId, status);
    }

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

  async findTasksWithoutWeekId(userId: number) {
    return await this.taskRepository.find({
      where: { weekId: IsNull(), userId },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        backlogRank: true,
        categories: {
          id: true,
          title: true,
          emoji: true,
          color: true
        }
      },
      relations: { categories: true },
      order: { backlogRank: 'ASC' }
    });
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const editedTask: Task | null = await this.taskRepository.findOne({
      where: { id },
      relations: { categories: true }
    });

    if (!editedTask) throw new NotFoundException('Task not found');

    if (userId !== editedTask.userId) throw new ForbiddenException('User cannot update this task');

    const { taskCategories } = updateTaskDto;

    if (taskCategories?.length) {
      const foundCategories = await this.categoryService.findCategories(taskCategories, userId);

      if (!foundCategories.length) throw new NotFoundException('Categories not found');

      foundCategories.forEach((cat) => editedTask.categories.push(cat));

      await this.taskRepository.save(editedTask);
    }

    delete updateTaskDto.taskCategories;

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

  async getTotalCompletedTasks(userId: number): Promise<number> {
    return await this.taskRepository.count({
      where: { userId, status: TaskStatus.DONE }
    });
  }

  async getTotalBacklogItems(userId: number): Promise<number> {
    return await this.taskRepository.count({
      where: { userId, status: TaskStatus.CREATED }
    });
  }

  async findBacklogRank(userId: number, weekId: number): Promise<string> {
    const task = await this.taskRepository.findOne({
      select: { id: true, backlogRank: true },
      where: { userId, weekId },
      order: {
        backlogRank: 'ASC'
      }
    });

    if (!task?.backlogRank) return LexoRank.min().toString();

    return LexoRank.parse(task.backlogRank).genNext().toString();
  }

  async findBoardRank(userId: number, weekId: number, status: TaskStatus): Promise<string> {
    const task = await this.taskRepository.findOne({
      select: { id: true, backlogRank: true },
      where: { userId, weekId, status },
      order: {
        backlogRank: 'ASC'
      }
    });

    if (!task?.backlogRank) return LexoRank.min().toString();

    return LexoRank.parse(task.backlogRank).genNext().toString();
  }

  async moveTasksToBacklog(tasks: Task[], statuses: TaskStatus[], resetStatus: boolean = false) {
    for (const task of tasks) {
      if (statuses.includes(task.status)) {
        if (resetStatus) task.status = TaskStatus.CREATED;

        task.weekId = null;
        task.boardRank = null;
        task.backlogRank = null;
      }
    }

    await this.taskRepository.save(tasks);
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
