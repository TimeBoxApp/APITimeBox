import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { WeekService } from './week.service';
import { UserRequest } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateWeekDto } from './dto/create-week.dto';
import { UpdateWeekDto } from './dto/update-week.dto';

@Controller('week')
export class WeekController {
  constructor(
    private readonly weekService: WeekService,

    private readonly userService: UserService
  ) {}

  @Post()
  create(@Req() request: UserRequest, @Body() createWeekDto: CreateWeekDto) {
    return this.weekService.create(createWeekDto, request.user.userId);
  }

  // @Get()
  // findAll() {
  //   return this.weekService.findAll();
  // }

  @Get(':id')
  async findOne(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);
    return this.weekService.findOne(+id, user.id);
  }

  @Post(':id/finish')
  async finishWeek(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);
    return this.weekService.finishWeek(+id, user.id);
  }

  @Patch(':id')
  update(@Req() request: UserRequest, @Param('id') id: string, @Body() updateWeekDto: UpdateWeekDto) {
    return this.weekService.update(+id, request.user.userId, updateWeekDto);
  }

  @Delete(':id')
  remove(@Req() request: UserRequest, @Param('id') id: string) {
    return this.weekService.remove(+id, request.user.userId);
  }
}
