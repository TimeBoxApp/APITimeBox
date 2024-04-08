import { IsString, IsOptional, Length, IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsDateString()
  start: Date;

  @IsDateString()
  end: Date;

  @IsInt()
  taskId: number;

  @IsBoolean()
  @IsOptional()
  isDraggable?: boolean;

  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;
}
