import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, Product } from '@prisma/client';
import { NotificationGateway } from 'src/api/notification/gateway/notification.gatway';
import { ProductService } from 'src/api/product/service/product.service';
import { BaseService } from 'src/common/abstract/service.abstract';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/query.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderRepository } from '../repository/order.repository';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { PaginationDateMapper, PaginationMapper } from 'src/common/pagination/service/pagination-mapper.service';
import * as util from 'util'

@Injectable()
export class OrderService extends BaseService<
    Order,
    CreateOrderDto,
    UpdateOrderDto
> {
    constructor(
        private orderRepository: OrderRepository,
        private prismaService: PrismaService,
        private productService: ProductService,
        private notificationGateway: NotificationGateway,
    ) {
        super(orderRepository);
    }

    async create(
        createOrderDto: CreateOrderDto,
        userInterface?: UserInterface,
    ) {
        try {
            const product = await this.productService.findOne(
                createOrderDto.productId,
            );
            if (!product)
                throw new BadRequestException('product does not exist');
            const order = this.mapToOrder(
                createOrderDto,
                product,
                userInterface,
            );
            await this.notificationGateway.sendMessage(
                JSON.stringify(order),
                'order',
                order.assignee,
            );
            return this.orderRepository.createOrder(order);
        } catch (error) {
            throw error;
        }
    }

    private mapToOrder(
        createOrderDto: CreateOrderDto,
        product: Product,
        userInterface?: UserInterface,
    ): CreateOrderDto {
        createOrderDto.assignee = product.userId;
        const dueTime = this.calculateDueTime(product.durationTime);
        const order = {
            ...createOrderDto,
            assignedTo: {
                connect: { id: createOrderDto.userId || userInterface.user },
            },
            product: { connect: { id: createOrderDto.productId } },
            orderTime: new Date(),
            orderNumber:
                `${product.name}` + `${product.id}` + `${new Date().getTime()}`,
            dueTime,
        };
        delete order.productId;
        delete order.userId;
        return order;
    }

    private calculateDueTime(durationTime: number): Date {
        const dueTime = new Date();
        dueTime.setDate(dueTime.getDate() + durationTime);
        return dueTime;
    }

    async findAll(userInterface?: UserInterface) {
        try {
            return this.orderRepository.findAllOrder(userInterface);
        } catch (error) {
            throw error;
        }
    }

    async findOne(id: number) {
        try {
            return this.orderRepository.findOneOrder(id);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, updateOrderDto: UpdateOrderDto) {
        try {
            return this.orderRepository.updateOrder(id, updateOrderDto);
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return this.orderRepository.removeOrder(id);
        } catch (error) {
            throw error;
        }
    }

    async pagination(paginationQueryDto: PaginationQueryDto) {
        try {
            console.log(util.inspect(paginationQueryDto, true, 100, true));

            paginationQueryDto.include = {
                Label: true,
                assignedTo: true,
            };
            let whereCondition = {};
            if (paginationQueryDto.convertedFilter) {
                const { label, operator, lte, gte } =
                  paginationQueryDto.convertedFilter;
                if (label)
                  PaginationMapper(
                    'Label.some.id.in',
                    whereCondition,
                    label,
                  );
                if (operator)
                  PaginationMapper(
                    'assignedTo.some.id.in',
                    whereCondition,
                    operator,
                  );
                if (lte || gte) PaginationMapper('dueTime', whereCondition, {});
                if (lte)
                  paginationQueryDto.convertedFilter.lte &&
                    PaginationMapper(
                      'lte',
                      whereCondition['dueTime'],
                      new Date(PaginationDateMapper(lte, undefined)),
                    );
                if (gte)
                  paginationQueryDto.convertedFilter.gte &&
                    PaginationMapper(
                      'gte',
                      whereCondition['dueTime'],
                      new Date(PaginationDateMapper(undefined, gte)),
                    );
              }
            if (paginationQueryDto.convertedSearch) {
                const queries = [];
                let {
                    name,
                    email,
                    mobile,
                    order_number,
                }: Record<string, string> = paginationQueryDto.convertedSearch;
                let orderId: string[] = [];
                if (order_number) {
                    const query = this.prismaService
                        .getClient()
                        .$queryRawUnsafe(
                            'select id as id from "Order" o where o."orderNumber" like $1 limit $2',
                            `%${order_number}%`,
                            paginationQueryDto.limit,
                        );
                    queries.push(query);
                }
                if (name) {
                    const query = this.prismaService
                        .getClient()
                        .$queryRawUnsafe(
                            'select id as id from "Order" o where o."name" like $1 limit $2',
                            `%${name}%`,
                            paginationQueryDto.limit,
                        );
                    queries.push(query);
                }
                if (email) {
                    const query = this.prismaService
                        .getClient()
                        .$queryRawUnsafe(
                            'select id as id from "Order" o where o."email" like $1 limit $2',
                            `%${email}%`,
                            paginationQueryDto.limit,
                        );
                    queries.push(query);
                }
                if (mobile) {
                    const query = this.prismaService
                        .getClient()
                        .$queryRawUnsafe(
                            'select id as id from "Order" o where o."mobile" like $1 limit $2',
                            `%${mobile}%`,
                            paginationQueryDto.limit,
                        );
                    queries.push(query);
                }
                const [
                    order_numberRes,
                    nameRes,
                    mobileRes,
                    emailRes,
                ] = await Promise.all(queries);
                let x: { id: string; }[] = [
                    ...(<[]>(order_numberRes ? order_numberRes : [])),
                    ...(<[]>(nameRes ? nameRes : [])),
                    ...(<[]>(emailRes ? emailRes : [])),
                    ...(<[]>(mobileRes ? mobileRes : [])),
                ];
                let y = x.map((t) => t.id);
                orderId.push(...new Set(y));
                if (orderId.length < 1) {
                    orderId = [' '];
                }
                console.log(orderId);
                PaginationMapper('id.in', whereCondition, orderId);
            }
            paginationQueryDto.convertedFilter = whereCondition;
            if (!paginationQueryDto.orderBy) {
                paginationQueryDto.orderBy = [{ id: 'desc' }];
            }
            const data = await this.orderRepository.pagination(paginationQueryDto);
            return data;
        } catch (error) {
            throw error;
        }
    }
}
