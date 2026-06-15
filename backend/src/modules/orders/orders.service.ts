import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { OrderItems } from './entity/order-items';
import { OrderItemToppings } from './entity/order-item-toppings';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto.dto';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { OrderStatus } from '../../common/enums/common.enum';
import { Products } from '../products/entity/products.entity';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { Toppings } from '../toppings/entity/toppings.entity';

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
        relations: [
          'orderItems',
          'orderItems.orderItemToppings',
          'orderItems.product',
        ],
      });
    });
  }

  async findAll(paginationParams: PaginationParamsDto) {
    const { status, ...paginationOptions } = paginationParams;
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.orderItemToppings', 'orderItemToppings')
      .leftJoinAndSelect('orderItems.product', 'product');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const result = await PaginationHelper.paginate(
      queryBuilder,
      paginationOptions,
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

  async findById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.orderItemToppings',
        'orderItems.product',
      ],
    });

    if (!order) {
      return { message: 'Order not found' };
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      return { message: 'Order not found' };
    }

    if (order.status !== OrderStatus.PENDING) {
      return { message: 'Order cannot be updated after status changed' };
    }

    const { orderItems, ...orderData } = updateOrderDto;

    return this.dataSource.transaction(async (manager) => {
      await manager.update(Orders, id, orderData);

      if (orderItems) {
        const oldOrderItems = await manager.find(OrderItems, {
          where: { orderId: id },
        });
        const oldOrderItemIds = oldOrderItems.map((orderItem) => orderItem.id);

        if (oldOrderItemIds.length > 0) {
          await manager.delete(OrderItemToppings, {
            orderItemId: In(oldOrderItemIds),
          });
        }

        await manager.delete(OrderItems, { orderId: id });

        for (const orderItemDto of orderItems) {
          const product = await manager.findOne(Products, {
            where: { id: orderItemDto.productId },
          });

          if (!product) {
            throw new BadRequestException('Product not found');
          }

          const categorySize = await manager.findOne(CategorySizes, {
            where: { id: orderItemDto.categorySizeId },
            relations: ['size'],
          });

          if (!categorySize) {
            throw new BadRequestException('Category size not found');
          }

          if (categorySize.categoryId !== product.categoryId) {
            throw new BadRequestException(
              'Category size does not match product category',
            );
          }

          const price = this.toNumber(product.price);
          const sizeExtraPrice = this.toNumber(categorySize.extraPrice);
          let toppingsAmount = 0;

          const orderItem = manager.create(OrderItems, {
            orderId: id,
            productId: product.id,
            categorySizeId: categorySize.id,
            productName: product.productName,
            sizeName: categorySize.size.name,
            sizeCode: categorySize.size.code,
            sizeExtraPrice,
            price,
            quantity: orderItemDto.quantity,
            subtotal: (price + sizeExtraPrice) * orderItemDto.quantity,
          });
          const savedOrderItem = await manager.save(OrderItems, orderItem);

          for (const orderItemToppingDto of orderItemDto.orderItemToppings ??
            []) {
            const topping = await manager.findOne(Toppings, {
              where: { id: orderItemToppingDto.toppingId },
            });

            if (!topping) {
              throw new BadRequestException('Topping not found');
            }

            const toppingPrice = this.toNumber(topping.price);
            toppingsAmount += toppingPrice * orderItemToppingDto.quantity;

            const orderItemTopping = manager.create(OrderItemToppings, {
              orderItemId: savedOrderItem.id,
              toppingId: topping.id,
              toppingName: topping.name,
              price: toppingPrice,
              quantity: orderItemToppingDto.quantity,
            });
            await manager.save(OrderItemToppings, orderItemTopping);
          }

          if (toppingsAmount > 0) {
            await manager.update(OrderItems, savedOrderItem.id, {
              subtotal:
                (price + sizeExtraPrice) * orderItemDto.quantity +
                toppingsAmount,
            });
          }
        }
      }

      return manager.findOne(Orders, {
        where: { id },
        relations: [
          'orderItems',
          'orderItems.orderItemToppings',
          'orderItems.product',
        ],
      });
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      return { message: 'Order not found' };
    }

    await this.ordersRepository.update(id, { status });

    return this.ordersRepository.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.orderItemToppings',
        'orderItems.product',
      ],
    });
  }

  private toNumber(value: number | string | null | undefined) {
    return Number(value ?? 0);
  }
}
