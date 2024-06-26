import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PreferencesModule } from '../preferences/preferences.module';
import { WeekModule } from '../week/week.module';
import { TaskModule } from '../task/task.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => WeekModule),
    TaskModule,
    forwardRef(() => CategoryModule),
    PreferencesModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
