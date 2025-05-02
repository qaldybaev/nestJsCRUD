import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class UpdateProductDto{
    @IsOptional()
    @IsString()
    @MinLength(4)
    name?:string

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?:number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    category_id?:number
}