import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CategoryServise } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dtos";
import { GetAllCategoryDto } from "./dtos/get-allCategory.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CheckFileSizePipe } from "src/pipes";


@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryServise) { }

    @Get()
    async getAllCategories(@Query() query: GetAllCategoryDto) {
        return await this.categoryService.getAllCategories(query)
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createCategory(@Body() body: CreateCategoryDto, @UploadedFile(new CheckFileSizePipe(200000)) image: Express.Multer.File) {
        return await this.categoryService.createCategory(body, image)
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCategoryDto,
        @UploadedFile(new CheckFileSizePipe(200000)) image?: Express.Multer.File
    ) {
        if (!image) {
            return await this.categoryService.updateCategory(id, body);
        }

        return await this.categoryService.updateCategory(id, body, image);
    }
    @Delete(':id')
    async deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return await this.categoryService.deleteCategory(id)
    }
}