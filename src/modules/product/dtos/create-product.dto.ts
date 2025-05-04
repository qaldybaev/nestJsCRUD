import { IsInt, IsNumberString, IsPositive, IsString, MinLength } from "class-validator"

export class ProductCreateDto{
    @IsString()
    name:string

    @IsNumberString()
    price:number

    @IsNumberString()
    category_id:number
}