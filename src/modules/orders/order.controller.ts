import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dtos";

@Controller('orders')
export class OrderController{
    constructor(private readonly orderService:OrderService){}

    @Get()
    async getAllOrder(){
        return this.orderService.getAllOrder()
    }
    @Post()
    async createOrder(@Body() body:CreateOrderDto){
        return this.orderService.createOrder(body)
    }
    @Delete(':id')
    @HttpCode(204)
    async deteteOrder(@Param('id',ParseIntPipe) id: number ){
        return this.orderService.deleteOrder(id)
    }
}