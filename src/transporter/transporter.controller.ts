import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { request_order_payload } from './transporter.config';
import { IOrderService } from 'src/order/structure/service.structure';
import { OrderService } from 'src/order/order.service';

@Controller()
export class TransporterController {
  constructor(
    @Inject(OrderService) private readonly orderService: IOrderService,
  ) {}

  @MessagePattern('request_order_topic')
  async RequestOrderTopic(@Payload() message: request_order_payload) {
    await this.orderService.pendingRequest(message.order_id);
    return 'Success';
  }
}
