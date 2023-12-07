import { Module } from '@nestjs/common';
import { TransporterController } from './transporter.controller';
import { OrderService } from 'src/order/order.service';
import { OrderRepository } from 'src/order/order.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TransporterController],
  providers: [OrderService, OrderRepository, PrismaService],
})
export class TransporterModule {}
