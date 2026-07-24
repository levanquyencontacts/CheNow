import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAddressDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  label: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  receiverName: string;

  @Transform(trim)
  @IsString()
  @Length(9, 20)
  @Matches(/^\+?[0-9][0-9 .-]{7,18}[0-9]$/, {
    message: 'receiverPhone must be a valid phone number',
  })
  receiverPhone: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  fullAddress: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @IsOptional()
  label?: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @IsOptional()
  receiverName?: string;

  @Transform(trim)
  @IsString()
  @Length(9, 20)
  @Matches(/^\+?[0-9][0-9 .-]{7,18}[0-9]$/, {
    message: 'receiverPhone must be a valid phone number',
  })
  @IsOptional()
  receiverPhone?: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  @IsOptional()
  fullAddress?: string;
}
