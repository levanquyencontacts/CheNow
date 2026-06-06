
import { IsInt } from "class-validator";

export class ProductStocksDto {
    @IsInt()
    quantity: number;
    @IsInt()
    minQuantity: number;
}
