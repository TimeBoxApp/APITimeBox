import { IsString, IsOptional, IsInt, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsInt()
  userId: number;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  description?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  emoji?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  color?: string;
}
