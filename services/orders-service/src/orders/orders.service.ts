import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OutboxEvent } from './outbox-event.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OutboxEvent) private readonly outboxRepo: Repository<OutboxEvent>,
  ) {}

  async create(dto: CreateOrderDto) {
    const order = this.ordersRepo.create({
      customerId: dto.customerId,
      totalAmount: dto.totalAmount.toFixed(2),
      state: 'CREATED',
      payload: { items: dto.items },
      idempotencyKey: dto.idempotencyKey || null,
    });
    const saved = await this.ordersRepo.save(order);
    const event = this.outboxRepo.create({
      aggregateId: saved.id,
      aggregateType: 'order',
      eventType: 'order.created',
      payload: {
        orderId: saved.id,
        customerId: saved.customerId,
        totalAmount: saved.totalAmount,
        items: dto.items,
        currency: 'USD',
      },
      attempts: 0,
      published: false,
    });
    await this.outboxRepo.save(event);
    return { id: saved.id, state: saved.state };
  }

  async findOne(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
