import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllProductDto {
    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    order?: "asc" | "desc";
}