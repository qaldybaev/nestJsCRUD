import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModel, ProductModel } from './modules';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,

  }),
CategoryModel,ProductModel],
})
export class AppModule { }
