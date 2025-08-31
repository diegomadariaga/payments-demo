import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OutboxEvent } from './outbox-event.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OutboxEvent])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
