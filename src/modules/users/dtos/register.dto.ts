import { IsNumberString, IsOptional, IsString } from "class-validator"

export class RegisterDto{
    @IsString()
    name:string

    @IsString()
    email:string

    @IsString()
    password:string
}
export class LoginDto{
    @IsString()
    email:string

    @IsString()
    password:string
}

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    name:string

    @IsOptional()
    @IsString()
    email:string

    @IsOptional()
    @IsString()
    password:string
}


export class GetAllUserDto {
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

