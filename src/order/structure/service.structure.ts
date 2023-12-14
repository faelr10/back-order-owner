import { Order } from '@prisma/client';

export type IProcessOrderParams = {
  order_id: string;
};

export type IFindByIdListParams = {
  id: string;
};

export type IUpdateStatusOrder = {
  id: string;
  status: string;
};

export interface IOrderService {
  pendingRequest(id: string): Promise<void>;
  processOrder(data: IProcessOrderParams): Promise<void>;
  getAllListOrders(): Promise<Order[]>;
  getOrderByIdList(params: IFindByIdListParams): Promise<any>;
  updateStatusOrder(params: IUpdateStatusOrder): Promise<Order>;
}
