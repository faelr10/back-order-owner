import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Constants, KafkaConfig } from './kafka.config';
import { OrderModule } from './order/order.module';
import { EventsModule } from './events/events.module';

const kafkaImport = ClientsModule.register([
  KafkaConfig(Constants.KafkaClientToken),
]);

@Module({
  imports: [kafkaImport, OrderModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
