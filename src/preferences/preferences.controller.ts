import { Controller, Get, Body, Patch, Param } from '@nestjs/common';

import { PreferencesService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserService } from '../user/user.service';

@Controller('preferences')
export class PreferencesController {
  constructor(
    private readonly preferencesService: PreferencesService,

    private readonly userService: UserService
  ) {}

  // @Post()
  // create(@Body() createPreferenceDto: CreatePreferenceDto) {
  //   return this.preferencesService.create(createPreferenceDto);
  // }

  @Get()
  findAll() {
    return this.preferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    return this.preferencesService.update(+id, updatePreferenceDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.preferencesService.remove(+id);
  // }
}
