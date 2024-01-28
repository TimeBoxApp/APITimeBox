import { DataSource } from 'typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { QueryFailedFilter } from './common/filters/query-failed.filter';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { dataSourceOptions } from '../db/data-source';
import { TaskModule } from './task/task.module';
import { WeekModule } from './week/week.module';
import { CategoryModule } from './category/category.module';
import { PreferencesModule } from './preferences/preferences.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'local',
      session: true
    }),
    UserModule,
    AuthModule,
    HealthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    TaskModule,
    WeekModule,
    CategoryModule,
    PreferencesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
