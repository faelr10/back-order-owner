import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { IOrderService } from './structure/service.structure';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: IOrderService,
  ) {}

  @Get()
  getAll() {
    return this.orderService.getAllListOrders();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
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
