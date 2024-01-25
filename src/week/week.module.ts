import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeekService } from './week.service';
import { WeekController } from './week.controller';
import { Week } from './entities/week.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule, TypeOrmModule.forFeature([Week, User])],
  controllers: [WeekController],
  providers: [WeekService, UserService]
})
export class WeekModule {}
