import { Module } from '@nestjs/common';
import { TransporterController } from './transporter.controller';

@Module({
  controllers: [TransporterController],
  providers: [],
})
export class TransporterModule {}
