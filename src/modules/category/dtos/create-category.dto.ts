import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateCategoryDto {
    @IsString()
    @MinLength(4)
    name: string;
    
    @IsOptional()
    @IsPositive()
    @IsInt()
    category_id?: number;
}