import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Week } from '../week/entities/week.entity';
import { TaskService } from '../task/task.service';
import { Task } from '../task/entities/task.entity';
import { Category } from '../category/entities/category.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule, TypeOrmModule.forFeature([User, Week, Task, Category])],
  providers: [UserService, TaskService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
