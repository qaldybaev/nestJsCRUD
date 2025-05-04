import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryServise } from "./category.service";
import { PostgresService } from "src/database";
import { LoggerMiddleware } from "src/middleware";
import { FsHelper } from "src/helper";

@Module({
    controllers:[CategoryController],
    providers:[CategoryServise,PostgresService,FsHelper]
})

export class  CategoryModel implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(CategoryController)
    }
}