import { IsString, IsOptional, Length } from 'class-validator';

export class CreateCategoryDto {
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
