import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { request_order_payload } from './transporter.config';

@Controller()
export class TransporterController {
  //constructor(private readonly prisma: PrismaService) {}

  @MessagePattern('request_order_topic')
  async RequestOrderTopic(@Payload() message: request_order_payload) {
    console.log(message);
    return 'Success';
  }
}
