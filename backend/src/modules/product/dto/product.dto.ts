import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsString()
    description?: string;
    @IsString()
    @IsOptional()
    image?: string;
    @IsNumber()
    quantity?: number;
}
