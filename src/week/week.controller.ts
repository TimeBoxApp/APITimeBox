import { Controller, Get, Param, Req } from '@nestjs/common';

import { WeekService } from './week.service';
import { UserRequest } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('week')
export class WeekController {
  constructor(
    private readonly weekService: WeekService,

    private readonly userService: UserService
  ) {}

  // @Post()
  // create(@Body() createWeekDto: CreateWeekDto) {
  //   return this.weekService.create(createWeekDto);
  // }

  // @Get()
  // findAll() {
  //   return this.weekService.findAll();
  // }

  @Get(':id')
  async findOne(@Req() request: UserRequest, @Param('id') id: string) {
    const user = await this.userService.getUserForRequest(request);

    return this.weekService.findOne(+id, user.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWeekDto: UpdateWeekDto) {
  //   return this.weekService.update(+id, updateWeekDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.weekService.remove(+id);
  // }
}
