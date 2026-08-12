import { BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  OrderType,
  PaymentMethod,
  RoleCode,
} from '../../common/enums/common.enum';
import { UserAddress } from '../addresses/entity/user-address.entity';
import { Users } from '../users/users.entities';
import { CreateOrderDto } from './dto/orderDto.dto';
import { Orders } from './entity/orders.entity';
import { OrderItemOptionsService } from '../order-items/order-item-options.service';
import { OrdersService } from './orders.service';

describe('OrdersService address ownership', () => {
  let manager: {
    create: jest.Mock;
    findOne: jest.Mock;
    getRepository: jest.Mock;
    save: jest.Mock;
  };
  let service: OrdersService;

  const user = {
    id: 7,
    userRole: {
      role: { code: RoleCode.CUSTOMER },
    },
  } as Users;
  const payload: CreateOrderDto = {
    addressId: 4,
    subtotalAmount: 50000,
    totalAmount: 65000,
    shippingFee: 15000,
    orderType: OrderType.DELIVERY,
    paymentMethod: PaymentMethod.CASH,
    orderItems: [],
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
      findOne: jest.fn(),
      getRepository: jest.fn(() => ({
        createQueryBuilder: jest.fn(() => queryBuilder),
      })),
      save: jest.fn((_entity: unknown, value: Record<string, unknown>) => ({
        ...value,
        id: 15,
      })),
    };
    const dataSource = {
      transaction: jest.fn((work: (entityManager: EntityManager) => unknown) =>
        work(manager as unknown as EntityManager),
      ),
    };

    service = new OrdersService(
      {} as Repository<Orders>,
      dataSource as unknown as DataSource,
      {} as OrderItemOptionsService,
    );
  });

  it('rejects an address that does not belong to the JWT user', async () => {
    manager.findOne.mockResolvedValueOnce(null);

    await expect(service.create(user, payload)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(manager.findOne).toHaveBeenCalledWith(UserAddress, {
      where: { id: payload.addressId, userId: user.id },
    });
    expect(manager.create).not.toHaveBeenCalled();
  });

  it('stores an owned address snapshot and the JWT user id', async () => {
    const address = {
      id: payload.addressId,
      userId: user.id,
      receiverName: 'Owned Receiver',
      receiverPhone: '0900000000',
      fullAddress: '12 Hang Bai, Hoan Kiem, Ha Noi',
    } as UserAddress;
    manager.findOne
      .mockResolvedValueOnce(address)
      .mockResolvedValueOnce({ id: 15 });

    await service.create(user, payload);

    expect(manager.create).toHaveBeenCalledWith(
      Orders,
      expect.objectContaining({
        userId: user.id,
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        deliveryAddress: address.fullAddress,
      }),
    );
  });
});

describe('OrdersService.createFromSnapshots', () => {
  let manager: {
    create: jest.Mock;
    findOne: jest.Mock;
    getRepository: jest.Mock;
    save: jest.Mock;
  };
  let service: OrdersService;

  const user = {
    id: 7,
    userRole: {
      role: { code: RoleCode.CUSTOMER },
    },
  } as Users;

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

    service = new OrdersService(
      {} as Repository<Orders>,
      {
        transaction: jest.fn(),
      } as unknown as DataSource,
      {} as OrderItemOptionsService,
    );
  });

  it('persists snapshot items inside the provided manager without wrapping a new transaction', async () => {
    const result = await service.createFromSnapshots(
      user,
      manager as unknown as EntityManager,
      {
        discountAmount: 0,
        orderType: OrderType.TAKEAWAY,
        paymentMethod: PaymentMethod.CASH,
        shippingFee: 0,
        subtotalAmount: 40000,
        totalAmount: 40000,
        orderItems: [
          {
            productId: 10,
            categorySizeId: 20,
            productName: 'Milk Tea',
            sizeName: 'M',
            sizeCode: 'M',
            sizeExtraPrice: 0,
            price: 40000,
            quantity: 1,
            subtotal: 40000,
            orderItemToppings: [],
          },
        ],
      },
    );

    expect(manager.create).toHaveBeenCalledWith(
      Orders,
      expect.objectContaining({
        userId: user.id,
        subtotalAmount: 40000,
        totalAmount: 40000,
      }),
    );
    expect(result).toEqual(expect.objectContaining({ id: 22 }));
  });

  it('rejects delivery without a valid owned address', async () => {
    manager.findOne.mockResolvedValueOnce(null);

    await expect(
      service.createFromSnapshots(
        user,
        manager as unknown as EntityManager,
        {
          orderType: OrderType.DELIVERY,
          paymentMethod: PaymentMethod.CASH,
          subtotalAmount: 40000,
          totalAmount: 40000,
          orderItems: [],
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
