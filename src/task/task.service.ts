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
import { WeekService } from '../week/week.service';
import { CategoryService } from '../category/category.service';
import { WeekStatus } from '../week/entities/week.entity';

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

  async create(userId: number, createTaskDto: CreateTaskDto) {
    const {
      title,
      description = null,
      status = TaskStatus.CREATED,
      dueDate = null,
      weekId,
      priority = null,
      taskCategories,
      boardRank = null,
      backlogRank = null
    } = createTaskDto;

    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.userId = userId;
    task.boardRank = boardRank;
    task.backlogRank = backlogRank;

    if (dueDate) task.dueDate = new Date(dueDate);

    if (!backlogRank) {
      const highestBacklogRank = await this.getHighestBacklogRank(userId, weekId);

      task.backlogRank = highestBacklogRank?.genNext().toString();
    }

    if (!boardRank) {
      const highestBoardRank = await this.getHighestBoardRank(userId, weekId, status);

      task.boardRank = highestBoardRank?.genNext().toString();
    }

    if (weekId) {
      const week = await this.weekService.findWeekWithoutTasks(weekId);

      if (!week) throw new NotFoundException('Week not found');

      if (week.userId !== userId) throw new ForbiddenException('User cannot create task in this week');

      task.weekId = weekId;
    } else task.boardRank = null;

    if (taskCategories?.length) {
      const categoriesFound = await this.categoryService.findCategories(taskCategories, userId);

      if (!categoriesFound.length) throw new NotFoundException('Categories not found');

      task.categories = [];
      categoriesFound.forEach((cat) => task.categories.push(cat));
    }

    return await this.taskRepository.save(task);
  }

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

    const tasksFiltered = tasks.map((task) => ({
      ...task,
      categories: task.categories.map((category) => category.id)
    }));

    return { tasks: this.groupTasksByStatus(tasksFiltered) };
  }

  async findTasksWithoutWeekId(userId: number) {
    const tasks = await this.taskRepository.find({
      where: { weekId: IsNull(), userId },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        backlogRank: true,
        categories: {
          id: true
        }
      },
      relations: { categories: true },
      order: { backlogRank: 'ASC' }
    });

    return tasks.map((task) => ({
      ...task,
      categories: task.categories.map((category) => category.id)
    }));
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const { dueDate, weekId, taskCategories } = updateTaskDto;
    const editedTask: Task | null = await this.taskRepository.findOne({
      where: { id },
      relations: { categories: true }
    });

    if (!editedTask) throw new NotFoundException('Task not found');

    if (userId !== editedTask.userId) throw new ForbiddenException('User cannot update this task');

    if (taskCategories) {
      const foundCategories = await this.categoryService.findCategories(taskCategories, userId);

      if (taskCategories.length && !foundCategories.length) throw new NotFoundException('Categories not found');

      foundCategories.forEach((cat) => editedTask.categories.push(cat));

      editedTask.categories = foundCategories;

      await this.taskRepository.save(editedTask);

      delete updateTaskDto.taskCategories;
    }

    if (weekId) {
      const week = await this.weekService.findWeekWithoutTasks(weekId);

      if (week.userId !== userId) throw new ForbiddenException('User cannot move task to this week');

      if (week.status === WeekStatus.IN_PROGRESS) {
        const highestBoardRank = await this.getHighestBoardRank(userId, weekId, TaskStatus.TO_DO);

        updateTaskDto.boardRank = highestBoardRank?.genNext().toString();
        updateTaskDto.status = TaskStatus.TO_DO;
      }
    }

    if (dueDate) updateTaskDto.dueDate = new Date(dueDate);

    await this.taskRepository.update({ id }, updateTaskDto);

    return { statusCode: HttpStatus.OK };
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

    this.logger.log(`User ${userId} has successfully removed task ${taskId}`);

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

  async getHighestBacklogRank(userId: number, weekId: number | null): Promise<LexoRank> {
    const task = await this.taskRepository.findOne({
      select: { id: true, backlogRank: true },
      where: { userId, weekId: weekId || IsNull() },
      order: {
        backlogRank: 'desc'
      }
    });

    if (!task?.backlogRank) return LexoRank.middle();

    return LexoRank.parse(task.backlogRank);
  }

  async getHighestBoardRank(userId: number, weekId: number, status: TaskStatus): Promise<LexoRank> {
    const task = await this.taskRepository.findOne({
      select: { id: true, boardRank: true },
      where: { userId, weekId: weekId || IsNull(), status },
      order: {
        boardRank: 'desc'
      }
    });

    if (!task?.boardRank) return LexoRank.middle();

    return LexoRank.parse(task.boardRank);
  }

  async moveTasksToBacklog(
    tasks: Task[],
    statuses: TaskStatus[] = [TaskStatus.CREATED, TaskStatus.IN_PROGRESS, TaskStatus.TO_DO, TaskStatus.DONE],
    resetStatus: boolean = false,
    startRank: LexoRank = LexoRank.middle()
  ): Promise<Task[]> {
    let previousLexoRank = startRank;

    for (const task of tasks) {
      if (!statuses.includes(task.status)) continue;

      if (resetStatus) task.status = TaskStatus.CREATED;

      const nextLexoRank = previousLexoRank.genNext();

      task.weekId = null;
      task.boardRank = null;
      task.backlogRank = nextLexoRank.toString();
      previousLexoRank = nextLexoRank;
    }

    return await this.taskRepository.save(tasks);
  }

  async moveTasksToBoard(tasks: Task[], startRank: LexoRank = LexoRank.middle()) {
    let previousLexoRank = startRank;

    for (const task of tasks) {
      const nextLexoRank = previousLexoRank.genNext();

      task.boardRank = nextLexoRank.toString();
      task.status = TaskStatus.TO_DO;
      previousLexoRank = nextLexoRank;
    }

    return await this.taskRepository.save(tasks);
  }

  /**
   * Group tasks by status
   * @param tasks
   */
  groupTasksByStatus = (tasks: any[]) => {
    const groupedTasks = _.groupBy(tasks, 'status');

    for (const status in groupedTasks) {
      groupedTasks[status] = _.orderBy(groupedTasks[status], ['boardRank'], ['asc']);
    }

    return groupedTasks;
  };
}
