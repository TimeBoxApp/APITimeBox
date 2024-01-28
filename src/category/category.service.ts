import { Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from '../user/entities/user.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  private readonly logger: Logger = new Logger(CategoryService.name);

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    if (createCategoryDto.userId !== user.id)
      throw new ForbiddenException('You can not create a category for another user');

    const category = this.categoryRepository.create(createCategoryDto);

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
  //
  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

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
