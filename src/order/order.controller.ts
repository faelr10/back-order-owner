import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll() {
    return this.orderService.getAllListOrders();
  }

  @Get(':id')
  getById(@Param('id') id: any) {
    return this.orderService.getOrderByIdList(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() data: any) {
    return this.orderService.updateStatusOrder({
      id,
      ...data,
    });
  }
}
