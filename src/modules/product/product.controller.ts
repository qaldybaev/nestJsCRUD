import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { IParamId, IProductCreate, IProductUpdate } from "./interface";

@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getAllProduct() {
        return this.productService.getAllProduct()
    }

    @Post()
    async createProduct(@Body() body: IProductCreate) {
        return this.productService.createProduct(body)
    }
    @Patch(':id')
    async updateProduct(@Param() params: IParamId, @Body() body: IProductUpdate) {

        return this.productService.updateProduct(+params.id, body)
    }
    @Delete(':id')
    async deleteProduct(@Param() params: IParamId) {

        return this.productService.deleteProduct(+params.id)
    }
}
