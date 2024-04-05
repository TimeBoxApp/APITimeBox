import { Controller, Get, Body, Patch, Req } from '@nestjs/common';

import { PreferencesService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserRequest } from '../user/entities/user.entity';
import { Preferences } from './entities/preferences.entity';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  async findAll(@Req() request: UserRequest): Promise<Preferences | null> {
    return this.preferencesService.findCustomerPreferences(request.user.userId);
  }

  @Patch()
  async update(@Req() request: UserRequest, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    return this.preferencesService.update(request.user.userId, updatePreferenceDto);
  }
}
