import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderService,
  IProcessOrderParams,
} from './structure/service.structure';
import { OrderRepository } from './order.repository';
import { IOrderRepository } from './structure/repository.structure';
import { Status } from '@prisma/client';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(OrderRepository) private readonly orderRepository: IOrderRepository,
  ) {}
  async processOrder(data: IProcessOrderParams): Promise<void> {
    try {
      await this.orderRepository.updateOrder({
        order_id: data.order_id,
        status: Status.PROCESSING,
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async pendingRequest(id: string): Promise<void> {
    //Enviar notificação para front owner
    console.log(id);

    return;
  }
}
