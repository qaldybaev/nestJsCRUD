import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryServise } from "./category.service";
import { PostgresService } from "src/database";

@Module({
    controllers:[CategoryController],
    providers:[CategoryServise,PostgresService]
})

export class  CategoryModel{}