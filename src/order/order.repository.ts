import { Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  IUpdateOrder,
  IUpdateStatusOrderRepository,
} from './structure/repository.structure';
import { PrismaService } from 'src/prisma.service';
import { IFindByIdListParams } from './structure/service.structure';
import { Order } from '@prisma/client';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  updateOrder(data: IUpdateOrder): Promise<any> {
    return this.prisma.order.update({
      where: { id: data.order_id },
      data: {
        status: data.status,
      },
    });
  }

  getAll(): Promise<any[]> {
    return this.prisma.order.findMany({
      include: {
        Account: true,
        OrderProduct: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getOrderByIdList(id: string): Promise<any> {
    return this.prisma.order.findFirst({
      where: { number_order_id: id },
      include: {
        Account: true,
        OrderProduct: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  updateStatusOrder(params: IUpdateStatusOrderRepository): Promise<Order> {
    return this.prisma.order.update({
      where: { number_order_id: params.id },
      data: {
        status: params.status,
      },
    });
  }
}
