import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModel, ProductModel } from './modules';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filter';
import { UserModel } from './modules/users/user.model';
import { LoggingInterceptor } from './interceptor/logginng-interceptor';
import { OrderModel } from './modules/orders';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,

  }),
    CategoryModel, ProductModel,UserModel,OrderModel],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
  {
    provide:APP_INTERCEPTOR,
    useClass:LoggingInterceptor
  }]
})
export class AppModule { }
