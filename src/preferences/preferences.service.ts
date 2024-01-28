import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Preferences } from './entities/preferences.entity';

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

  findAll() {
    return `This action returns all preferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preference`;
  }

  // update(id: number, updatePreferenceDto: UpdatePreferenceDto) {
  //   return `This action updates a #${id} preference`;
  // }

  remove(id: number) {
    return `This action removes a #${id} preference`;
  }
}
