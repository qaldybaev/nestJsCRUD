import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetAllProductDto, ProductCreateDto, UpdateProductDto } from "./dtos";
import { ParseIntCustonPipe } from "src/pipes";
import { FilesInterceptor } from "@nestjs/platform-express";



@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getAllProduct(@Query() query:GetAllProductDto) {
        return this.productService.getAllProduct(query)
    }

    @Post()
@UseInterceptors(FilesInterceptor('images'))
async createProduct(
    @Body() body: ProductCreateDto,
    @UploadedFiles() images: Express.Multer.File[],
) {
    return this.productService.createProduct(body, images);
}
@Patch(':id')
@UseInterceptors(FilesInterceptor('images'))
async updateProduct(
    @Param('id', ParseIntCustonPipe) id: number,
    @Body() body: UpdateProductDto,
    @UploadedFiles() images?: Express.Multer.File[],
) {
    return this.productService.updateProduct(id, body, images);
}
    @Delete(':id')
    async deleteProduct(@Param('id',ParseIntPipe) id:number) {

        return this.productService.deleteProduct(id)
    }
}
