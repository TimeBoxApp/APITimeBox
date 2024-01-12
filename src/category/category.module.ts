import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './category.controller';
import { UserService } from '../user/user.service';
import { Category } from './entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Week } from '../week/entities/week.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, Week])],
  controllers: [CategoryController],
  providers: [CategoryService, UserService]
})
export class CategoryModule {}
