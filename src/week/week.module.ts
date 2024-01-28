import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeekService } from './week.service';
import { WeekController } from './week.controller';
import { Week } from './entities/week.entity';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([Week]), forwardRef(() => UserModule), forwardRef(() => TaskModule)],
  providers: [WeekService],
  exports: [WeekService],
  controllers: [WeekController]
})
export class WeekModule {}
