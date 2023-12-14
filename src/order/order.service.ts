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
      throw error;
    }
  }

  async getAllListOrders(): Promise<any[]> {
    try {
      const listOrders = await this.orderRepository.getAll();

      return listOrders.map((order) => ({
        numer_order_id: order.numer_order_id,
        account_name: order.Account.name,
        status: order.status,
        price: order.price,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrderByIdList(params: IFindByIdListParams): Promise<any> {
    const order = await this.orderRepository.getOrderByIdList({
      id: params.id,
    });
    return order;
  }

  async updateStatusOrder(params: IUpdateStatusOrder): Promise<Order> {
    try {
      const statusMap: Record<string, Status> = {
        PROCESSING: Status.PROCESSING,
        COMPLETED: Status.COMPLETED,
      };
      const status: Status = statusMap[params.status];
      const update_order = await this.orderRepository.updateStatusOrder({
        id: params.id,
        status,
      });
      return update_order;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
