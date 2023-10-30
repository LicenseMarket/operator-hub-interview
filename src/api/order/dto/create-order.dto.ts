import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto implements Partial<OrderEntity> {
  @ApiHideProperty() orderNumber: string;
  @ApiHideProperty() orderTime: Date;
  @ApiHideProperty() dueTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiHideProperty() product: Record<string, any>;
  @ApiHideProperty() assignedTo: Record<string, any>;
}
