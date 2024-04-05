import { IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;
}
