import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OrderState = 'CREATED' | 'PAYMENT_PENDING' | 'PAYMENT_CONFIRMED' | 'PAYMENT_FAILED' | 'INVENTORY_RESERVED' | 'FULFILLED' | 'CANCELLED';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  totalAmount!: string; // store as string to avoid float issues

  @Column({ type: 'varchar', length: 32, default: 'CREATED' })
  state!: OrderState;

  @Column({ type: 'text', nullable: true })
  idempotencyKey?: string | null;

  @Column({ type: 'uuid', nullable: true })
  correlationId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  payload?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
