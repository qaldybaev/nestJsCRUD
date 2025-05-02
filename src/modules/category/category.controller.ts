import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { CategoryServise } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dtos";
import { GetAllCategoryDto } from "./dtos/get-allCategory.dto";


@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryServise) { }

    @Get()
    async getAllCategories(@Query() query:GetAllCategoryDto) {
        return await this.categoryService.getAllCategories(query)
    }

    @Post()

    async createCategory(@Body() body: CreateCategoryDto) {
        return await this.categoryService.createCategory(body)
    }

    @Put(':id')
    async updateCategory(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateCategoryDto) {
        return await this.categoryService.updateCategory(id, body)
    }
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return await this.categoryService.deleteCategory(id)
    }
}