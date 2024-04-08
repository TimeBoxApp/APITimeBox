import { In, Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Week, WeekStatus } from './entities/week.entity';
import { TaskService } from '../task/task.service';
import { TaskStatus } from '../task/entities/task.entity';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';

@Injectable()
export class WeekService {
  constructor(
    @InjectRepository(Week)
    private weekRepository: Repository<Week>,

    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService
  ) {}

  private readonly logger: Logger = new Logger(WeekService.name);

  async create(createWeekDto: CreateWeekDto, userId: number) {
    const newWeek = this.weekRepository.create({
      status: WeekStatus.PLANNED,
      name: createWeekDto.name,
      startDate: createWeekDto.startDate,
      endDate: createWeekDto.endDate,
      user: { id: userId }
    });

    await this.weekRepository.save(newWeek);

    return { statusCode: HttpStatus.CREATED };
  }

  async findOne(id: number, userId: number) {
    const weekWithTasks = await this.weekRepository.findOne({
      where: { id },
      relations: {
        tasks: {
          categories: true
        }
      },
      select: {
        id: true,
        name: true,
        userId: true,
        startDate: true,
        endDate: true,
        tasks: {
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
        }
      }
    });

    if (!weekWithTasks) throw new NotFoundException('Week not found');

    if (weekWithTasks.userId !== userId) throw new ForbiddenException('User does not have access to this week');

    return weekWithTasks;
  }

  async findActiveWeekForUser(userId: number) {
    return await this.weekRepository.findOne({
      where: { userId, status: WeekStatus.IN_PROGRESS },
      relations: {
        tasks: {
          categories: true
        }
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        tasks: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          boardRank: true,
          categories: {
            id: true
          }
        }
      }
    });
  }

  async findTasksForCalendar(userId: number) {
    const week = await this.weekRepository.findOne({
      where: { userId, status: WeekStatus.IN_PROGRESS },
      relations: {
        tasks: true
      },
      select: {
        id: true,
        tasks: {
          id: true,
          title: true,
          status: true,
          calendarEventId: true
        }
      }
    });

    if (!week) throw new NotFoundException('No week found');

    return week.tasks;
  }

  async findBacklogForUser(userId: number) {
    const weeks = await this.weekRepository.find({
      where: { userId, status: In([WeekStatus.IN_PROGRESS, WeekStatus.PLANNED]) },
      relations: {
        tasks: {
          categories: true
        }
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        tasks: {
          id: true,
          title: true,
          status: true,
          priority: true,
          backlogRank: true,
          categories: {
            id: true
          }
        }
      },
      order: { tasks: { backlogRank: 'asc' } }
    });
    const transformedWeeks = weeks.map((week) => ({
      ...week,
      tasks: week.tasks.map((task) => ({
        ...task,
        categories: task.categories.map((category) => category.id)
      }))
    }));
    const backlogTasks = await this.taskService.findTasksWithoutWeekId(userId);
    const currentWeekId = weeks.find((week) => week.status === WeekStatus.IN_PROGRESS)?.id;

    return { weeks: transformedWeeks, backlogTasks, currentWeekId };
  }

  async findWeekWithoutTasks(id: number) {
    const week = await this.weekRepository.findOne({
      where: { id }
    });

    if (!week) throw new NotFoundException('Week not found');

    return week;
  }

  async getTotalCompletedWeeks(userId: number): Promise<number> {
    return await this.weekRepository.count({
      where: { userId, status: WeekStatus.COMPLETED }
    });
  }

  async startWeek(weekId: number, userId: number): Promise<{ statusCode: HttpStatus }> {
    const [week, weeksInProgressCount] = await Promise.all([
      this.weekRepository.findOne({
        where: { id: weekId },
        select: {
          id: true,
          userId: true,
          status: true,
          tasks: {
            id: true,
            backlogRank: true,
            boardRank: true,
            status: true,
            weekId: true
          }
        },
        relations: { tasks: true },
        order: { tasks: { backlogRank: 'ASC' } }
      }),
      this.weekRepository.count({
        where: {
          userId,
          status: WeekStatus.IN_PROGRESS
        }
      })
    ]);

    if (!week) throw new NotFoundException('Week not found');

    if (weeksInProgressCount !== 0) throw new BadRequestException('User already has weeks in progress');

    if (userId !== week.userId) throw new ForbiddenException('User cannot start this week');

    if (week.status !== WeekStatus.PLANNED) throw new ForbiddenException('Week cannot be started');

    await Promise.all([
      this.taskService.moveTasksToBoard(week.tasks),
      this.weekRepository.update(week.id, { status: WeekStatus.IN_PROGRESS })
    ]);

    return { statusCode: HttpStatus.OK };
  }

  async finishWeek(weekId: number, userId: number): Promise<object> {
    const [week, backlogRank] = await Promise.all([
      await this.weekRepository.findOne({
        where: { id: weekId, userId },
        select: {
          id: true,
          status: true,
          tasks: {
            id: true,
            status: true,
            boardRank: true,
            weekId: true
          }
        },
        relations: { tasks: true }
      }),
      this.taskService.getHighestBacklogRank(userId, null)
    ]);

    if (!week) throw new NotFoundException('Week not found');

    if (week.status !== WeekStatus.IN_PROGRESS) throw new BadRequestException('Week is not in progress');

    await Promise.all([
      this.taskService.moveTasksToBacklog(
        week.tasks,
        [TaskStatus.CREATED, TaskStatus.IN_PROGRESS, TaskStatus.TO_DO],
        true,
        backlogRank
      ),
      this.weekRepository.update(week.id, { status: WeekStatus.COMPLETED })
    ]);

    return { statusCode: HttpStatus.OK };
  }

  async update(id: number, userId: number, updateWeekDto: UpdateWeekDto) {
    const week = await this.weekRepository.findOne({
      where: { id, userId }
    });

    if (!week) throw new NotFoundException('Week not found');

    await this.weekRepository.update(id, updateWeekDto);

    return { statusCode: HttpStatus.OK };
  }

  async remove(id: number, userId: number) {
    const [week, backlogRank] = await Promise.all([
      this.weekRepository.findOne({
        where: { id, userId },
        select: {
          id: true,
          status: true,
          tasks: {
            id: true,
            status: true,
            boardRank: true,
            weekId: true
          }
        },
        relations: { tasks: true }
      }),
      this.taskService.getHighestBacklogRank(userId, null)
    ]);

    if (!week) throw new NotFoundException('Week not found');

    if (week.status === WeekStatus.IN_PROGRESS) throw new ForbiddenException('Week is in progress');

    await this.taskService.moveTasksToBacklog(
      week.tasks,
      [TaskStatus.CREATED, TaskStatus.IN_PROGRESS, TaskStatus.TO_DO, TaskStatus.DONE],
      true,
      backlogRank
    );
    await this.weekRepository.remove(week);

    return { statusCode: HttpStatus.OK };
  }
}
