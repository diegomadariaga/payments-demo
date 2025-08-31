import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  sku!: string;

  @IsNumber()
  qty!: number;

  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsString()
  customerId!: string;

  @IsNumber()
  totalAmount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
