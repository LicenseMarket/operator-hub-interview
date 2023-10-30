import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrderRepository } from './repository/order.repository';
import { PaginationService } from 'src/common/pagination/service/create.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, PaginationService],
  exports: [OrderService]
})
export class OrderModule {}