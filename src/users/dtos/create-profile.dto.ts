// src/user/dtos/create-profile.dto.ts
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: 'male' | 'female' ;

  @IsOptional()
  @Transform(({ value }) => new Date(value))  // Transform the string into a Date object
  @IsDate()
  dateOfBirth?: Date;


  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;
}
