// src/user/dtos/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';
import { CreateProfileDto } from './create-profile.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.PATIENT;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;


}
