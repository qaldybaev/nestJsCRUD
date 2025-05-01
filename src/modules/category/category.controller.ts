import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoryServise } from "./category.service";
import { ICreateCategory, IParamId, IUpdateCategory } from "./interface/category.interface";

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryServise) { }

    @Get()
    async getAllCategories() {
        return await this.categoryService.getAllCategories()
    }

    @Post()

    async createCategory(@Body() body: ICreateCategory) {
        return await this.categoryService.createCategory(body)
    }

    @Put(':id')
    async updateCategory(@Param() params: IParamId, @Body() body: IUpdateCategory) {
        return await this.categoryService.updateCategory(+params?.id, body)
    }
    @Delete(':id')
    async deleteCategory(@Param() param: IParamId) {
        return await this.categoryService.deleteCategory(+param?.id)
    }
}