import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PostgresService } from "src/database";

@Module({
    controllers: [ProductController],
    providers: [ProductService, PostgresService]
})

export class ProductModel { }