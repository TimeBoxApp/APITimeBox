import { IsEnum, IsInt, IsOptional, IsString, Length, MaxLength } from 'class-validator';

import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.CREATED;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority | null;

  @IsOptional()
  @IsString()
  dueDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  boardRank?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  backlogRank?: string | null;

  @IsInt()
  @IsOptional()
  categoryId: number | null;

  @IsInt()
  weekId: number;

  @IsInt()
  userId: number;
}
