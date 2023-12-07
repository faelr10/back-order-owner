import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { KafkaConfig } from './kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    KafkaConfig(),
  );

  // Inicie o microserviço Kafka
  await app.listen();

  // Inicie o servidor HTTP
  const httpApp = await NestFactory.create(AppModule);
  await httpApp.listen(3001);
}
bootstrap();
