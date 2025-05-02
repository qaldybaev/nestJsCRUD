import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PostgresService } from "src/database";

@Module({
    controllers: [UserController],
    providers: [UserService, PostgresService]
})

export class UserModel { }