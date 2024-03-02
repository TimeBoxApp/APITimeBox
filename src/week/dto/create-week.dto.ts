import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateWeekDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
