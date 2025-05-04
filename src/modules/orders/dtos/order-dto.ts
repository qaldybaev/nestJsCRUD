import { IsNumber } from "class-validator"

export class CreateOrderDto {
    @IsNumber()
    product_id: number

    @IsNumber()
    user_id: number
    
    @IsNumber()
    count: number
}