export const kafkaConfig = {
  client: {
    kafkaHost: 'localhost:9092',
  },
};

export const request_order_topic = 'request_order_topic';

export type request_order_payload = {
  origin: string;
  order_id: string;
  status: string;
};
