import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderService,
  IProcessOrderParams,
  IUpdateStatusOrder,
} from './structure/service.structure';
import { OrderRepository } from './order.repository';
import { IOrderRepository } from './structure/repository.structure';
import { Order, OrderProduct, Status } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
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

      const modifiedOrders = await Promise.all(
        listOrders.map(async (order) => {
          const { account_id, OrderProduct, ...restOrder } = order;

          const modifiedOrder = {
            ...restOrder,
            OrderProduct: await Promise.all(
              OrderProduct.map(
                async ({ order_id, product_id, ...restProduct }) => {
                  return restProduct;
                },
              ),
            ),
          };
          modifiedOrder.price = new Decimal(
            parseFloat(modifiedOrder.price.toFixed(2)),
          );
          return modifiedOrder;
        }),
      );

      return modifiedOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrderByIdList(id: string): Promise<any> {
    try {
      const exists_order = await this.orderRepository.getOrderByIdList(id);
      if (!exists_order) {
        throw new Error('Order not found!');
      }

      const { account_id, OrderProduct, ...order } = exists_order;
      const modifiedOrder = {
        ...order,
        OrderProduct: OrderProduct.map(
          ({ order_id, product_id, ...rest }) => rest,
        ),
      };

      modifiedOrder.price = new Decimal(
        parseFloat(modifiedOrder.price.toFixed(2)),
      );

      return modifiedOrder;
    } catch (error) {
      console.error(error);
      throw error();
    }
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
