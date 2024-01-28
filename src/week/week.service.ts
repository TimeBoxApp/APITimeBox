import { Repository } from 'typeorm';
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

import { Week, WeekStatus } from './entities/week.entity';
import { TaskService } from '../task/task.service';

@Injectable()
export class WeekService {
  constructor(
    @InjectRepository(Week)
    private weekRepository: Repository<Week>,

    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService
  ) {}

  private readonly logger: Logger = new Logger(WeekService.name);

  // create(createWeekDto: CreateWeekDto) {
  //   return 'This action adds a new week';
  // }

  // findAll() {
  //   return `This action returns all week`;
  // }

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
            id: true,
            title: true,
            emoji: true,
            color: true
          }
        }
      }
    });
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

  async finishWeek(weekId: number, userId: number): Promise<object> {
    const week = await this.weekRepository.findOne({
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
    });

    if (!week) throw new NotFoundException('Week not found');

    if (week.status !== WeekStatus.IN_PROGRESS) throw new ForbiddenException('Week is not in progress');

    week.status = WeekStatus.COMPLETED;

    await Promise.all([this.taskService.moveUnfinishedTasksToBacklog(week.tasks), this.weekRepository.save(week)]);

    return { statusCode: HttpStatus.OK };
  }

  // update(id: number, updateWeekDto: UpdateWeekDto) {
  //   return `This action updates a #${id} week`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} week`;
  // }
}
