import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PostgresService } from "src/database";
import { FsHelper } from "src/helper";

@Module({
    controllers: [ProductController],
    providers: [ProductService, PostgresService,FsHelper]
})

export class ProductModel { }