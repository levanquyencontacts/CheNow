import { BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import {
  OrderType,
  PaymentMethod,
  ProductStatus,
  RoleCode,
} from '../../common/enums/common.enum';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';
import { OrdersService } from '../orders/orders.service';
import { Products } from '../products/entity/products.entity';
import { Users } from '../users/users.entities';
import { CartsService } from './carts.service';
import { CheckoutCartDto } from './dto/cart.dto';
import { CartItems } from './entity/cart-item.entity';
import { Carts } from './entity/cart.entity';

describe('CartsService.checkout', () => {
  let cartsRepository: { findOne: jest.Mock };
  let manager: {
    create: jest.Mock;
    delete: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    getRepository: jest.Mock;
    save: jest.Mock;
  };
  let ordersService: { createFromSnapshots: jest.Mock };
  let service: CartsService;

  const user = {
    id: 7,
    userRole: { role: { code: RoleCode.CUSTOMER } },
  } as Users;

  const cart = { id: 1, userId: user.id };

  const product = {
    id: 10,
    categoryId: 1,
    productName: 'Milk Tea',
    price: 30000,
    status: ProductStatus.ACTIVE,
  } as Products;

  const categorySize = {
    id: 20,
    categoryId: 1,
    extraPrice: 5000,
    size: { name: 'Large', code: 'L' },
  } as CategorySizes;

  const selectedItem = {
    id: 101,
    cartId: 1,
    productId: product.id,
    categorySizeId: categorySize.id,
    quantity: 2,
    note: 'less sugar',
    product,
    categorySize,
    cartItemToppings: [
      {
        toppingId: 50,
        topping: { id: 50, name: 'Pearl', price: 8000 },
      },
    ],
  };

  const baseDto: CheckoutCartDto = {
    cartItemIds: [101],
    orderType: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
  };

  beforeEach(() => {
    cartsRepository = {
      findOne: jest.fn().mockResolvedValue(cart),
    };
    manager = {
      create: jest.fn((_entity: unknown, value: unknown) => value),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      getRepository: jest.fn((entity: unknown) => {
        if (entity === Carts) {
          return {
            create: jest.fn((_value: unknown) => _value),
            findOne: jest.fn().mockResolvedValue(cart),
            save: jest.fn(async (value: unknown) => value),
          };
        }
        return {};
      }),
      save: jest.fn((_entity: unknown, value: unknown) => value),
    };
    ordersService = {
      createFromSnapshots: jest.fn().mockResolvedValue({
        id: 99,
        orderItems: [{ productId: product.id, quantity: 2 }],
        subtotalAmount: 86000,
        totalAmount: 86000,
      }),
    };
    const dataSource = {
      transaction: jest.fn(
        async (work: (entityManager: EntityManager) => Promise<unknown>) =>
          work(manager as unknown as EntityManager),
      ),
    };

    service = new CartsService(
      cartsRepository as unknown as Repository<Carts>,
      dataSource as unknown as DataSource,
      ordersService as unknown as OrdersService,
    );
  });

  function mockValidSelectedItems(items: Array<typeof selectedItem>) {
    manager.find.mockImplementation(
      (
        entity: unknown,
        options?: {
          lock?: { mode: string };
          relations?: string[];
          where?: unknown;
        },
      ) => {
        if (entity === CartItems) {
          return Promise.resolve(items);
        }
        if (entity === CategoryToppings) {
          return Promise.resolve([{ toppingId: 50, categoryId: 1 }]);
        }
        return Promise.resolve([]);
      },
    );
    manager.findOne.mockImplementation(
      (entity: unknown, _options?: { where: { id: number } }) => {
        if (entity === Products) {
          return Promise.resolve(product);
        }
        if (entity === CategorySizes) {
          return Promise.resolve(categorySize);
        }
        return Promise.resolve(null);
      },
    );
  }

  it('creates an order from selected items and keeps unselected cart items', async () => {
    mockValidSelectedItems([selectedItem]);

    const order = await service.checkout(user, {
      ...baseDto,
      // subset only — id 102 remains in cart (not requested, so not deleted)
      cartItemIds: [101],
    });

    expect(manager.find).toHaveBeenCalledWith(CartItems, {
      where: { cartId: 1, id: In([101]) },
      lock: { mode: 'pessimistic_write' },
    });
    expect(ordersService.createFromSnapshots).toHaveBeenCalledWith(
      user,
      manager,
      expect.objectContaining({
        discountAmount: 0,
        orderType: OrderType.TAKEAWAY,
        paymentMethod: PaymentMethod.CASH,
        shippingFee: 0,
        subtotalAmount: 86000,
        totalAmount: 86000,
        orderItems: [
          expect.objectContaining({
            productId: 10,
            categorySizeId: 20,
            productName: 'Milk Tea',
            sizeName: 'Large',
            sizeCode: 'L',
            sizeExtraPrice: 5000,
            price: 30000,
            quantity: 2,
            subtotal: 86000,
            note: 'less sugar',
            orderItemToppings: [
              expect.objectContaining({
                toppingId: 50,
                toppingName: 'Pearl',
                price: 8000,
                quantity: 2,
              }),
            ],
          }),
        ],
      }),
    );
    expect(manager.delete).toHaveBeenCalledTimes(1);
    expect(manager.delete).toHaveBeenCalledWith(CartItems, {
      cartId: 1,
      id: In([101]),
    });
    expect(order).toEqual(
      expect.objectContaining({
        id: 99,
        subtotalAmount: 86000,
      }),
    );
  });

  it('locks selected cart items with pessimistic_write before creating an order', async () => {
    mockValidSelectedItems([selectedItem]);

    await service.checkout(user, baseDto);

    expect(manager.find).toHaveBeenNthCalledWith(1, CartItems, {
      where: { cartId: 1, id: In([101]) },
      lock: { mode: 'pessimistic_write' },
    });
    expect(manager.find.mock.calls[0][1]).not.toHaveProperty('relations');
  });

  it('rejects concurrent loser when locked find returns fewer items than requested', async () => {
    // Simulates the second overlapping checkout after the winner deleted rows:
    // FOR UPDATE unblocks, then find sees missing ids.
    manager.find.mockResolvedValueOnce([]);

    await expect(service.checkout(user, baseDto)).rejects.toThrow(
      'Selected cart items are invalid',
    );
    expect(ordersService.createFromSnapshots).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('rejects when selected cart items are missing from the user cart', async () => {
    manager.find.mockResolvedValue([]);

    await expect(
      service.checkout(user, { ...baseDto, cartItemIds: [999] }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.checkout(user, { ...baseDto, cartItemIds: [999] }),
    ).rejects.toThrow('Selected cart items are invalid');
    expect(ordersService.createFromSnapshots).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('rejects delivery checkout without addressId', async () => {
    mockValidSelectedItems([selectedItem]);
    ordersService.createFromSnapshots.mockRejectedValue(
      new BadRequestException('A valid delivery address is required'),
    );

    await expect(
      service.checkout(user, {
        ...baseDto,
        orderType: OrderType.DELIVERY,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('rejects inactive products before creating an order', async () => {
    manager.find
      .mockResolvedValueOnce([selectedItem]) // lock pass
      .mockResolvedValueOnce([selectedItem]); // relations load
    manager.findOne.mockResolvedValueOnce({
      ...product,
      status: ProductStatus.INACTIVE,
    });

    await expect(service.checkout(user, baseDto)).rejects.toThrow(
      'Product is not available',
    );
    expect(ordersService.createFromSnapshots).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('does not delete cart items when createFromSnapshots fails', async () => {
    mockValidSelectedItems([selectedItem]);
    ordersService.createFromSnapshots.mockRejectedValue(
      new Error('invoice conflict'),
    );

    await expect(service.checkout(user, baseDto)).rejects.toThrow(
      'invoice conflict',
    );
    expect(manager.delete).not.toHaveBeenCalled();
  });
});
