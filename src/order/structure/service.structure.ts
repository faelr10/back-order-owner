export type IProcessOrderParams = {
  order_id: string;
};

export interface IOrderService {
  pendingRequest(id: string): Promise<void>;
  processOrder(data: IProcessOrderParams): Promise<void>;
}
