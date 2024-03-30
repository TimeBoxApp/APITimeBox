import { In, Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../user/entities/user.entity';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  private readonly logger: Logger = new Logger(CategoryService.name);

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = this.categoryRepository.create({ ...createCategoryDto, userId: user.id });

    category.user = user;

    const newCategory = await this.categoryRepository.save(category);

    this.logger.log(`Created new category with id: ${newCategory.id}`);

    return newCategory;
  }

  // findAll() {
  //   return `This action returns all category`;
  // }
  //
  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: { id }
    });
  }

  async findCategories(categories: [number], userId: number) {
    return await this.categoryRepository.find({
      where: { id: In(categories), userId }
    });
  }

  async update(id: number, userId: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.find({
      where: { id, userId }
    });

    if (!category) throw new NotFoundException(`Category ${id} not found`);

    return await this.categoryRepository.save({ id, ...updateCategoryDto });
  }

  async getUserCategories(userId: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { userId },
      select: { id: true, color: true, title: true, description: true, emoji: true }
    });
  }

  async remove(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      select: {
        id: true,
        userId: true
      }
    });

    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);

    if (category.userId !== userId) throw new ForbiddenException('You can not delete a category for another user');

    await this.categoryRepository.remove(category);

    return { statusCode: HttpStatus.OK, message: 'OK' };
  }
}
