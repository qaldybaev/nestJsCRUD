import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryServise } from "./category.service";
import { PostgresService } from "src/database";
import { LoggerMiddleware } from "src/middleware";

@Module({
    controllers:[CategoryController],
    providers:[CategoryServise,PostgresService]
})

export class  CategoryModel implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(CategoryController)
    }
}