import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
