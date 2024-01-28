import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Preferences } from './entities/preferences.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preferences)
    private preferencesRepository: Repository<Preferences>
  ) {}

  async create(userId: number) {
    const preferences = new Preferences();

    preferences.userId = userId;

    return await this.preferencesRepository.save(preferences);
  }

  async findCustomerPreferences(userId: number): Promise<Preferences | null> {
    return await this.preferencesRepository.findOne({
      where: { userId },
      select: {
        isPomodoroEnabled: true,
        isBookListEnabled: true,
        toDoColumnName: true,
        inProgressColumnName: true,
        doneColumnName: true
      }
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} preference`;
  // }

  async update(userId: number, updatePreferenceDto: UpdatePreferenceDto): Promise<object> {
    await this.preferencesRepository.update({ userId }, updatePreferenceDto);

    return { statusCode: HttpStatus.OK };
  }
}
