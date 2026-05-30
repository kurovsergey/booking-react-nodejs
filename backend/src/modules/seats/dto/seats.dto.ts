import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkingSeatDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price!: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsUUID()
  officeId!: string;
}

export class UpdateWorkingSeatDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsUUID()
  @IsOptional()
  officeId?: string;
}
