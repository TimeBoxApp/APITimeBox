import { Controller, Get, Body, Patch, Req } from '@nestjs/common';

import { PreferencesService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserService } from '../user/user.service';
import { UserRequest } from '../user/entities/user.entity';
import { Preferences } from './entities/preferences.entity';

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
  async findAll(@Req() request: UserRequest): Promise<Preferences | null> {
    const user = await this.userService.getUserForRequest(request);

    return this.preferencesService.findCustomerPreferences(user.id);
  }

  @Patch()
  async update(@Req() request: UserRequest, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    const user = await this.userService.getUserForRequest(request);

    return this.preferencesService.update(user.id, updatePreferenceDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.preferencesService.remove(+id);
  // }
}
