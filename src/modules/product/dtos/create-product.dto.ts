import { IsInt, IsNumber, IsPositive, IsString, MinLength } from "class-validator"

export class ProductCreateDto{
    @IsString()
    name:string

    @IsNumber()
    @IsPositive()
    price:number

    @IsNumber()
    @IsPositive()
    category_id:number
}