import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetAllUserDto, LoginDto, RegisterDto, UpdateUserDto } from "./dtos";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUser(@Query() query: GetAllUserDto) {
        return this.userService.getAllUser(query)
    }
    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.userService.register(body)
    }
    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.userService.login(body)
    }
    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(id, body)
    }
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id)
    }

}