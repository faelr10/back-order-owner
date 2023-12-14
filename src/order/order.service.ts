import { Inject, Injectable } from '@nestjs/common';
import {
  IFindByIdListParams,
  IOrderService,
  IProcessOrderParams,
  IUpdateStatusOrder,
} from './structure/service.structure';
import { OrderRepository } from './order.repository';
import { IOrderRepository } from './structure/repository.structure';
import { Order, Status } from '@prisma/client';
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
    console.log(id);
    return;
  }

  async getAllListOrders(): Promise<any[]> {
    try {
      const listOrders = await this.orderRepository.getAll();
      const list = [];

      listOrders.forEach((order) => {
        list.push({
          order_id: order.order_list_id,
          account_name: order.Account.name,
          status: order.status,
        });
      });

      return list;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderByIdList(params: IFindByIdListParams): Promise<any> {
    const order = await this.orderRepository.getOrderByIdList({
      id: params.id,
    });
    return order;
  }

  async updateStatusOrder(params: IUpdateStatusOrder): Promise<Order> {
    let status: Status;
    if (params.status === 'PROCESSING') {
      status = Status.PROCESSING;
    } else if (params.status === 'COMPLETED') {
      status = Status.COMPLETED;
    }
    const update_order = await this.orderRepository.updateStatusOrder({
      id: params.id,
      status,
    });
    return update_order;
  }
}
