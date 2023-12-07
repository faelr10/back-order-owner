import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Constants, KafkaConfig } from './kafka.config';
import { TransporterModule } from './transporter/transporter.module';
import { OrderModule } from './order/order.module';

const kafkaImport = ClientsModule.register([
  KafkaConfig(Constants.KafkaClientToken),
]);

@Module({
  imports: [kafkaImport, TransporterModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
