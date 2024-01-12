import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { Week } from '../week/entities/week.entity';
import { Category } from '../category/entities/category.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Category, Week, User])],
  controllers: [TaskController],
  providers: [TaskService, UserService]
})
export class TaskModule {}
