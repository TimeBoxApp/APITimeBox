import { PartialType } from '@nestjs/mapped-types';
import { CreateWeekDto } from './create-week.dto';

export class UpdateWeekDto extends PartialType(CreateWeekDto) {}
