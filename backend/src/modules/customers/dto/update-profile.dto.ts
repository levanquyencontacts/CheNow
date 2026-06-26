import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomerGender } from '../../users/entity/users.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string | null;

  @IsOptional()
  @IsString()
  birthday?: string | null;

  @IsOptional()
  @IsEnum(CustomerGender)
  gender?: CustomerGender;
}
