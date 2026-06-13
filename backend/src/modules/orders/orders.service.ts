import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItems } from './entity/order-items';
import { OrderItemToppings } from './entity/order-item-toppings';
import { CreateOrderDto } from './dto/orderDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemsRepository: Repository<OrderItems>,
    @InjectRepository(OrderItemToppings)
    private orderItemToppingsRepository: Repository<OrderItemToppings>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      orderItems,
      discountAmount = 0,
      shippingFee = 0,
      ...orderData
    } = createOrderDto;

    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Orders, {
        ...orderData,
        discountAmount,
        shippingFee,
      });
      const savedOrder = await manager.save(Orders, order);

      for (const orderItemDto of orderItems) {
        const { orderItemToppings = [], ...orderItemData } = orderItemDto;
        const orderItem = manager.create(OrderItems, {
          ...orderItemData,
          orderId: savedOrder.id,
        });
        const savedOrderItem = await manager.save(OrderItems, orderItem);

        for (const orderItemToppingDto of orderItemToppings) {
          const orderItemTopping = manager.create(OrderItemToppings, {
            ...orderItemToppingDto,
            orderItemId: savedOrderItem.id,
          });
          await manager.save(OrderItemToppings, orderItemTopping);
        }
      }

      return manager.findOne(Orders, {
        where: { id: savedOrder.id },
        relations: ['orderItems', 'orderItems.orderItemToppings'],
      });
    });
  }

  async findAll(paginationParams: PaginationParamsDto) {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.orderItemToppings', 'orderItemToppings');

    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationParams,
      [
        'id',
        'userId',
        'subtotalAmount',
        'discountAmount',
        'shippingFee',
        'totalAmount',
        'orderType',
        'paymentMethod',
        'paymentStatus',
        'status',
        'receiverName',
        'receiverPhone',
        'createdAt',
        'updatedAt',
      ],
      'id',
      ['receiverName', 'receiverPhone', 'deliveryAddress', 'note'],
    );

    return ResponseHelper.createPaginatedResponse(result, (order) => order);
  }
}
