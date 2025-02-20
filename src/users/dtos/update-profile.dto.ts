// src/user/dtos/update-profile.dto.ts
import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;
}
