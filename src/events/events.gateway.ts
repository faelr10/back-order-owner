import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Consumer, Kafka, Message, Producer, ProducerRecord } from 'kafkajs';
import { Server, Socket } from 'socket.io';

const group_id_postman = 'client_postman';
const group_id_front = 'client_front';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  private kafka: Kafka;
  private kafkaProducer: Producer;
  private kafkaConsumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CONSUMER_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
    });

    this.kafkaProducer = this.kafka.producer();
  }

  private createKafkaConsumer(groupId: string) {
    const kafkaConsumer = this.kafka.consumer({
      groupId,
    });

    kafkaConsumer.connect();
    kafkaConsumer.subscribe({ topic: process.env.KAFKA_TOPIC_REQUEST_ORDER });

    kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const convert_message = JSON.parse(message.value.toString());
        delete convert_message.origin;
        this.server.emit('new_order', convert_message);
      },
    });

    return kafkaConsumer;
  }

  async handleConnection(client: Socket) {
    await this.handleDisconnect(client);

    let group_id: string;
    if (client.handshake.headers.authorization === 'client_postman') {
      group_id = group_id_postman;
    } else {
      group_id = group_id_front;
    }

    this.logger.log(`New client connection: ${client.id}`);
    client.join(group_id);

    const kafkaConsumer = this.createKafkaConsumer(group_id);
    this.kafkaConsumers.set(client.id, kafkaConsumer);
  }

  async handleDisconnect(client: Socket) {
    const kafkaConsumer = this.kafkaConsumers.get(client.id);

    if (kafkaConsumer) {
      await kafkaConsumer.disconnect();
      this.kafkaConsumers.delete(client.id);
    }
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
      topic: process.env.KAFKA_TOPIC_UPDATE_ORDER,
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
