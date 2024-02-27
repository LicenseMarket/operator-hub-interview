import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Order } from 'prisma/prisma-client';
import { BaseEntity } from 'src/common/entities/base.entity';

export class OrderEntity extends BaseEntity implements Order {
    email: string;
    mobile: string;
    @ApiProperty() name: string;
    @ApiProperty() status: $Enums.OrderStatus;
    @ApiProperty() id: number;
    @ApiProperty() orderNumber: string;
    @ApiProperty() assignee: number;
    @ApiProperty({ required: false, default: false }) orderTime: Date;
    @ApiProperty({ required: false, default: false }) dueTime: Date;
    @ApiProperty({ required: false, default: false }) deleted: Date;
    @ApiProperty() productId: number;
    @ApiProperty() userId: number;
}
