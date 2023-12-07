import { Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  IUpdateOrder,
} from './structure/repository.structure';
import { PrismaService } from 'src/prisma.service';

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
}
