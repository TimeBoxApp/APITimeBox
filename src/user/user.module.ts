import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PreferencesModule } from '../preferences/preferences.module';
import { WeekModule } from '../week/week.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => WeekModule),
    forwardRef(() => TaskModule),
    forwardRef(() => PreferencesModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
