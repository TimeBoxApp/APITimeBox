import { Module } from '@nestjs/common';

import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { PreferencesModule } from '../preferences/preferences.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { TaskModule } from '../task/task.module';
import { WeekModule } from '../week/week.module';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  imports: [PreferencesModule, UserModule, TaskModule, WeekModule, ConfigModule],
  exports: [CalendarService]
})
export class CalendarModule {}
