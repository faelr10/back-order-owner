import { Status } from '@prisma/client';

export type IUpdateOrder = {
  order_id: string;
  status: Status;
};

export interface IOrderRepository {
  updateOrder(data: IUpdateOrder): Promise<any>;
}
