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
        Product: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  getOrderByIdList(params: IFindByIdListParams): Promise<any> {
    try {
      return this.prisma.order.findFirst({
        where: { numer_order_id: params.id },
        include: {
          Account: true,
          Product: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  updateStatusOrder(params: IUpdateStatusOrderRepository): Promise<Order> {
    return this.prisma.order.update({
      where: { numer_order_id: params.id },
      data: {
        status: params.status,
      },
    });
  }
}
