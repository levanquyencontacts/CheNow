import { BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  OrderType,
  PaymentMethod,
  RoleCode,
} from '../../common/enums/common.enum';
import { OrderItemOptionsService } from '../order-items/order-item-options.service';
import { Users } from '../users/users.entities';
import { CreateDirectOrderDto } from './dto/create-direct-order.dto';
import { Orders } from './entity/orders.entity';
import { OrdersService } from './orders.service';

describe('OrdersService.createDirectOrder', () => {
  let manager: {
    create: jest.Mock;
    findOne: jest.Mock;
    getRepository: jest.Mock;
    save: jest.Mock;
  };
  let orderItemOptionsService: {
    validateAndBuildSnapshot: jest.Mock;
  };
  let service: OrdersService;

  const user = {
    id: 7,
    userRole: { role: { code: RoleCode.CUSTOMER } },
  } as Users;

  const snapshot = {
    categorySizeId: 20,
    note: null,
    orderItemToppings: [],
    price: 30000,
    productId: 10,
    productName: 'Milk Tea',
    quantity: 2,
    sizeCode: 'L',
    sizeExtraPrice: 5000,
    sizeName: 'Large',
    subtotal: 70000,
  };

  const baseDto: CreateDirectOrderDto = {
    productId: 10,
    categorySizeId: 20,
    quantity: 2,
    orderType: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
  };

  beforeEach(() => {
    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    };
    manager = {
      create: jest.fn((_entity: unknown, value: unknown): unknown => value),
      findOne: jest.fn().mockResolvedValue({ id: 22 }),
      getRepository: jest.fn(() => ({
        createQueryBuilder: jest.fn(() => queryBuilder),
      })),
      save: jest.fn((_entity: unknown, value: Record<string, unknown>) => ({
        ...value,
        id: 22,
        status: value.status,
      })),
    };
    orderItemOptionsService = {
      validateAndBuildSnapshot: jest.fn().mockResolvedValue(snapshot),
    };
    const dataSource = {
      transaction: jest.fn(
        async (work: (entityManager: EntityManager) => Promise<unknown>) =>
          work(manager as unknown as EntityManager),
      ),
    };

    service = new OrdersService(
      {} as Repository<Orders>,
      dataSource as unknown as DataSource,
      orderItemOptionsService as unknown as OrderItemOptionsService,
    );
  });

  it('builds snapshot then calls createFromSnapshots (no cart)', async () => {
    const order = await service.createDirectOrder(user, baseDto);

    expect(orderItemOptionsService.validateAndBuildSnapshot).toHaveBeenCalledWith(
      manager,
      {
        productId: baseDto.productId,
        categorySizeId: baseDto.categorySizeId,
        quantity: baseDto.quantity,
        toppingIds: baseDto.toppingIds,
        note: baseDto.note,
      },
    );
    expect(manager.create).toHaveBeenCalledWith(
      Orders,
      expect.objectContaining({
        userId: user.id,
        subtotalAmount: 70000,
        totalAmount: 70000,
        shippingFee: 0,
      }),
    );
    expect(order).toEqual(expect.objectContaining({ id: 22 }));
  });

  it('rejects delivery without addressId', async () => {
    manager.findOne.mockResolvedValueOnce(null);

    await expect(
      service.createDirectOrder(user, {
        ...baseDto,
        orderType: OrderType.DELIVERY,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(orderItemOptionsService.validateAndBuildSnapshot).toHaveBeenCalled();
  });

  it('applies shipping fee to total', async () => {
    await service.createDirectOrder(user, {
      ...baseDto,
      shippingFee: 15000,
    });

    expect(manager.create).toHaveBeenCalledWith(
      Orders,
      expect.objectContaining({
        subtotalAmount: 70000,
        shippingFee: 15000,
        totalAmount: 85000,
      }),
    );
  });
});
