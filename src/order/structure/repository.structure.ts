import { Order, Status } from '@prisma/client';

export type IUpdateOrder = {
  order_id: string;
  status: Status;
};

export type IUpdateStatusOrderRepository = {
  id: string;
  status: Status;
};

export interface IOrderRepository {
  updateOrder(data: IUpdateOrder): Promise<any>;
  getAll(): Promise<any[]>;
  getOrderByIdList(id: string): Promise<any>;
  updateStatusOrder(params: IUpdateStatusOrderRepository): Promise<Order>;
}
