import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  workingSeatId!: string;

  @IsUUID()
  @IsNotEmpty()
  officeId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(['confirmed', 'pending', 'cancelled'])
  @IsOptional()
  status?: string;
}
