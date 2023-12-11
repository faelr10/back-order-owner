import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Consumer, Kafka, Message, Producer, ProducerRecord } from 'kafkajs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  private kafka: Kafka;
  private kafkaConsumer: Consumer;
  private kafkaProducer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CONSUMER_GROUP_ID,
      brokers: ['localhost:9092', 'kafka-broker2:9092'],
    });

    this.kafkaConsumer = this.kafka.consumer({
      groupId: 'test',
    });

    this.kafkaConsumer.connect();
    this.kafkaConsumer.subscribe({ topic: 'request_order_topic' });

    this.kafkaProducer = this.kafka.producer();
  }

  handleConnection(client: Socket) {
    this.logger.log(`New client connection: ${client.id}`);

    const runKafkaConsumer = async () => {
      await this.kafkaConsumer.run({
        eachMessage: async ({ message }) => {
          const convert_message = JSON.parse(message.value.toString());
          delete convert_message.origin;
          client.emit('new_order', convert_message);
        },
      });
    };
    runKafkaConsumer();
  }

  @SubscribeMessage('order_status')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log(data);

    const message: Message = {
      value: JSON.stringify(data),
    };
    const payload: ProducerRecord = {
      topic: 'update_order_topic',
      messages: [message],
    };

    const run = async () => {
      await this.kafkaProducer.connect();
      await this.kafkaProducer.send(payload);
    };
    run();

    client.emit('order_status', 'Client alerted!');
    return data;
  }
}
