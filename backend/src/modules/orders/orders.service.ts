import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { PaginationParamsDto } from '../../common/dtos/request.dto';
import {
  Order,
  OrderStatus,
  OrderType,
  RoleCode,
} from '../../common/enums/common.enum';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { Products } from '../products/entity/products.entity';
import { Toppings } from '../toppings/entity/toppings.entity';
import { UserAddress } from '../addresses/entity/user-address.entity';
import { Users } from '../users/users.entities';
import { CreateOrderDto, UpdateOrderDto } from './dto/orderDto.dto';
import { OrderItemToppings } from './entity/order-item-toppings';
import { OrderItems } from './entity/order-items';
import { OrderStatusLogs } from './entity/order-status-logs.entity';
import { Orders } from './entity/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    private readonly dataSource: DataSource,
  ) {}

  async create(currentUser: Users, createOrderDto: CreateOrderDto) {
    const {
      addressId,
      orderItems,
      discountAmount = 0,
      shippingFee = 0,
      receiverName,
      receiverPhone,
      deliveryAddress,
      ...orderData
    } = createOrderDto;

    return this.dataSource.transaction(async (manager) => {
      const deliverySnapshot = await this.resolveDeliverySnapshot(
        manager,
        currentUser,
        orderData.orderType,
        addressId,
        {
          receiverName,
          receiverPhone,
          deliveryAddress,
        },
      );
      const isPrivileged = this.isPrivileged(currentUser);
      const invoiceCode = await this.generateInvoiceCode(manager);
      const order = manager.create(Orders, {
        ...orderData,
        discountAmount,
        ...deliverySnapshot,
        invoiceCode,
        shippingFee,
        status: isPrivileged ? orderData.status : OrderStatus.PENDING,
        userId: currentUser.id,
      });
      const savedOrder = await manager.save(Orders, order);
      await this.createStatusLog(manager, {
        changedByUserId: currentUser.id,
        fromStatus: null,
        note: 'Order created',
        orderId: savedOrder.id,
        toStatus: savedOrder.status,
      });

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
          'statusLogs',
        ],
      });
    });
  }

  async findMyOrders(
    currentUser: Users,
    paginationParams: PaginationParamsDto,
  ) {
    const { status, ...paginationOptions } = paginationParams;
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.orderItemToppings', 'orderItemToppings')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.userId = :userId', { userId: currentUser.id });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const result = await PaginationHelper.paginate(
      queryBuilder,
      {
        ...paginationOptions,
        order: paginationOptions.order ?? Order.DESC,
        sort: paginationOptions.sort ?? 'createdAt',
      },
      [
        'id',
        'invoiceCode',
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
      'createdAt',
      ['invoiceCode'],
    );

    return ResponseHelper.createPaginatedResponse(result, (order) => order);
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
        'invoiceCode',
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
      [
        'invoiceCode',
        'receiverName',
        'receiverPhone',
        'deliveryAddress',
        'note',
      ],
    );

    return ResponseHelper.createPaginatedResponse(result, (order) => order);
  }

  async findMyOrderById(currentUser: Users, id: number) {
    const order = await this.ordersRepository.findOne({
      order: { statusLogs: { createdAt: 'ASC' } },
      relations: [
        'orderItems',
        'orderItems.orderItemToppings',
        'orderItems.product',
        'statusLogs',
      ],
      where: { id, userId: currentUser.id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelMyOrder(currentUser: Users, id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id, userId: currentUser.id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Orders, id, { status: OrderStatus.CANCELLED });
      await this.createStatusLog(manager, {
        changedByUserId: currentUser.id,
        fromStatus: order.status,
        note: 'Order cancelled by customer',
        orderId: id,
        toStatus: OrderStatus.CANCELLED,
      });
    });

    return this.findMyOrderById(currentUser, id);
  }

  async findById(id: number) {
    const order = await this.ordersRepository.findOne({
      order: { statusLogs: { createdAt: 'ASC' } },
      where: { id },
      relations: [
        'orderItems',
        'orderItems.orderItemToppings',
        'orderItems.product',
        'statusLogs',
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
          'statusLogs',
        ],
      });
    });
  }

  async updateStatus(id: number, status: OrderStatus, changedByUser?: Users) {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      return { message: 'Order not found' };
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Orders, id, { status });
      await this.createStatusLog(manager, {
        changedByUserId: changedByUser?.id ?? null,
        fromStatus: order.status,
        note: 'Order status updated',
        orderId: id,
        toStatus: status,
      });
    });

    return this.ordersRepository.findOne({
      order: { statusLogs: { createdAt: 'ASC' } },
      where: { id },
      relations: [
        'orderItems',
        'orderItems.orderItemToppings',
        'orderItems.product',
        'statusLogs',
      ],
    });
  }

  private toNumber(value: number | string | null | undefined) {
    return Number(value ?? 0);
  }

  private async resolveDeliverySnapshot(
    manager: EntityManager,
    currentUser: Users,
    orderType: OrderType,
    addressId: number | undefined,
    manualSnapshot: {
      receiverName?: string;
      receiverPhone?: string;
      deliveryAddress?: string;
    },
  ) {
    if (orderType !== OrderType.DELIVERY) {
      return {};
    }

    if (addressId) {
      const address = await manager.findOne(UserAddress, {
        where: { id: addressId, userId: currentUser.id },
      });

      if (!address) {
        throw new BadRequestException(
          'Delivery address not found for current user',
        );
      }

      return {
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        deliveryAddress: address.fullAddress,
      };
    }

    if (
      this.isPrivileged(currentUser) &&
      manualSnapshot.receiverName &&
      manualSnapshot.receiverPhone &&
      manualSnapshot.deliveryAddress
    ) {
      return manualSnapshot;
    }

    throw new BadRequestException('A valid delivery address is required');
  }

  private isPrivileged(user: Users) {
    const roleCode = user.userRole?.role.code;
    return roleCode === RoleCode.ADMIN || roleCode === RoleCode.STAFF;
  }

  private async createStatusLog(
    manager: EntityManager,
    payload: {
      changedByUserId?: number | null;
      fromStatus: OrderStatus | null;
      note?: string | null;
      orderId: number;
      toStatus: OrderStatus;
    },
  ) {
    const statusLog = manager.create(OrderStatusLogs, payload);

    return manager.save(OrderStatusLogs, statusLog);
  }

  private async generateInvoiceCode(manager: EntityManager) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const dateKey = this.toInvoiceDateKey(today);
    const prefix = `HD${dateKey}`;
    const latestOrder = await manager
      .getRepository(Orders)
      .createQueryBuilder('order')
      .select(['order.invoiceCode'])
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.createdAt < :endDate', { endDate })
      .andWhere('order.invoiceCode LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('order.invoiceCode', 'DESC')
      .getOne();

    const latestSequence = latestOrder?.invoiceCode
      ? Number(latestOrder.invoiceCode.slice(prefix.length))
      : 0;
    const nextSequence = Number.isFinite(latestSequence)
      ? latestSequence + 1
      : 1;

    return `${prefix}${String(nextSequence).padStart(2, '0')}`;
  }

  private toInvoiceDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }
}
