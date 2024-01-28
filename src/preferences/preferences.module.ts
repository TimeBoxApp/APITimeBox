import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Preferences } from './entities/preferences.entity';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preferences]), forwardRef(() => UserModule)],
  controllers: [PreferencesController],
  providers: [PreferencesService],
  exports: [PreferencesService]
})
export class PreferencesModule {}
