import { Order, Status } from '@prisma/client';

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
export type IAllDataOrders = {
  id: string;
  order_list_id: string;
  account_id: string;
  product_id: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
};

export interface IOrderService {
  processOrder(data: IProcessOrderParams): Promise<void>;
  getAllListOrders(): Promise<Order[]>;
  getOrderByIdList(params: IFindByIdListParams): Promise<any>;
  updateStatusOrder(params: IUpdateStatusOrder): Promise<Order>;
}
