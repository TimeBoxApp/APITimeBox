import { Repository } from 'typeorm';
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Week } from './entities/week.entity';

@Injectable()
export class WeekService {
  constructor(
    @InjectRepository(Week)
    private weekRepository: Repository<Week>
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

  // update(id: number, updateWeekDto: UpdateWeekDto) {
  //   return `This action updates a #${id} week`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} week`;
  // }
}
