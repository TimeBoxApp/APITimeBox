import { IsString, IsOptional, Length, IsBoolean, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;

  @IsBoolean()
  @IsOptional()
  isDraggable?: boolean;

  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;
}
