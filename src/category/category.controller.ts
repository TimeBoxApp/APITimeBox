import { Controller, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserRequest } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,

    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Req() request: UserRequest, @Body() createCategoryDto: CreateCategoryDto) {
    const user = await this.userService.getUserForRequest(request);

    return await this.categoryService.create(createCategoryDto, user);
  }

  // @Get()
  // findAll() {
  //   return this.categoryService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  async remove(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);

    return await this.categoryService.remove(+id, user.id);
  }
}
