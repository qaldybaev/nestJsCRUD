import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetAllProductDto, ProductCreateDto, UpdateProductDto } from "./dtos";
import { ParseIntCustonPipe } from "src/pipes";



@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getAllProduct(@Query() query:GetAllProductDto) {
        return this.productService.getAllProduct(query)
    }

    @Post()
    async createProduct(@Body() body: ProductCreateDto) {
        return this.productService.createProduct(body)
    }
    @Patch(':id')
    async updateProduct(@Param('id',ParseIntCustonPipe) id:number, @Body() body: UpdateProductDto) {

        return this.productService.updateProduct(id, body)
    }
    @Delete(':id')
    async deleteProduct(@Param('id',ParseIntPipe) id:number) {

        return this.productService.deleteProduct(id)
    }
}
