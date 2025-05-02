import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModel, ProductModel } from './modules';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter';
import { UserModel } from './modules/users/user.model';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,

  }),
    CategoryModel, ProductModel,UserModel],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }]
})
export class AppModule { }
