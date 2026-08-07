import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { ProductStatus } from '../../common/enums/common.enum';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';
import { OrdersService } from '../orders/orders.service';
import { Products } from '../products/entity/products.entity';
import { Users } from '../users/users.entities';
import {
  AddCartItemDto,
  CheckoutCartDto,
  UpdateCartItemDto,
} from './dto/cart.dto';
import { CartItemToppings } from './entity/cart-item-topping.entity';
import { CartItems } from './entity/cart-item.entity';
import { Carts } from './entity/cart.entity';

type NormalizedCartOption = {
  categorySize: CategorySizes;
  note: string;
  product: Products;
  toppingIds: number[];
};

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Carts)
    private cartsRepository: Repository<Carts>,
    private readonly dataSource: DataSource,
    private readonly ordersService: OrdersService,
  ) {}

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.toCartResponse(cart.id);
  }

  async addItem(userId: number, payload: AddCartItemDto) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getOrCreateCart(userId, manager);
      const option = await this.validateCartOption(
        {
          categorySizeId: payload.categorySizeId,
          note: payload.note,
          productId: payload.productId,
          toppingIds: payload.toppingIds,
        },
        manager,
      );

      const existingItem = await this.findMatchingItem(
        cart.id,
        option.product.id,
        option.categorySize.id,
        option.note,
        option.toppingIds,
        manager,
      );

      if (existingItem) {
        await manager.update(CartItems, existingItem.id, {
          quantity: existingItem.quantity + payload.quantity,
        });
      } else {
        const cartItem = await manager.save(
          CartItems,
          manager.create(CartItems, {
            cartId: cart.id,
            categorySizeId: option.categorySize.id,
            note: option.note,
            productId: option.product.id,
            quantity: payload.quantity,
          }),
        );

        await this.replaceItemToppings(cartItem.id, option.toppingIds, manager);
      }

      return this.toCartResponse(cart.id, manager);
    });
  }

  async updateItem(
    userId: number,
    cartItemId: number,
    payload: UpdateCartItemDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getOrCreateCart(userId, manager);
      const currentItem = await manager.findOne(CartItems, {
        where: { cartId: cart.id, id: cartItemId },
        relations: ['cartItemToppings'],
      });

      if (!currentItem) {
        throw new NotFoundException('Cart item not found');
      }

      const option = await this.validateCartOption(
        {
          categorySizeId: payload.categorySizeId ?? currentItem.categorySizeId,
          note: payload.note ?? currentItem.note ?? '',
          productId: currentItem.productId,
          toppingIds:
            payload.toppingIds ??
            currentItem.cartItemToppings.map((item) => item.toppingId),
        },
        manager,
      );
      const quantity = payload.quantity ?? currentItem.quantity;
      const matchingItem = await this.findMatchingItem(
        cart.id,
        option.product.id,
        option.categorySize.id,
        option.note,
        option.toppingIds,
        manager,
        currentItem.id,
      );

      if (matchingItem) {
        await manager.update(CartItems, matchingItem.id, {
          quantity: matchingItem.quantity + quantity,
        });
        await manager.delete(CartItems, currentItem.id);
      } else {
        await manager.update(CartItems, currentItem.id, {
          categorySizeId: option.categorySize.id,
          note: option.note,
          quantity,
        });
        await this.replaceItemToppings(
          currentItem.id,
          option.toppingIds,
          manager,
        );
      }

      return this.toCartResponse(cart.id, manager);
    });
  }

  async removeItem(userId: number, cartItemId: number) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getOrCreateCart(userId, manager);
      await manager.delete(CartItems, { cartId: cart.id, id: cartItemId });
      return this.toCartResponse(cart.id, manager);
    });
  }

  async clearCart(userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getOrCreateCart(userId, manager);
      await manager.delete(CartItems, { cartId: cart.id });
      return this.toCartResponse(cart.id, manager);
    });
  }

  async checkout(user: Users, dto: CheckoutCartDto) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getOrCreateCart(user.id, manager);
      const cartItemIds = [...new Set(dto.cartItemIds)];

      // Claim selected rows before pricing/order create so concurrent
      // checkouts cannot read the same items under READ COMMITTED.
      const lockedItems = await manager.find(CartItems, {
        where: { cartId: cart.id, id: In(cartItemIds) },
        lock: { mode: 'pessimistic_write' },
      });

      if (lockedItems.length !== cartItemIds.length) {
        throw new BadRequestException('Selected cart items are invalid');
      }

      const cartItems = await manager.find(CartItems, {
        where: { cartId: cart.id, id: In(cartItemIds) },
        relations: [
          'product',
          'categorySize',
          'categorySize.size',
          'cartItemToppings',
          'cartItemToppings.topping',
        ],
      });

      const orderItemSnapshots: Array<{
        categorySizeId: number;
        note: string | null;
        orderItemToppings: Array<{
          price: number;
          quantity: number;
          toppingId: number;
          toppingName: string;
        }>;
        price: number;
        productId: number;
        productName: string;
        quantity: number;
        sizeCode: string;
        sizeExtraPrice: number;
        sizeName: string;
        subtotal: number;
      }> = [];
      let subtotalAmount = 0;

      for (const cartItem of cartItems) {
        const toppingIds = (cartItem.cartItemToppings ?? []).map(
          (cartTopping) => cartTopping.toppingId,
        );
        const option = await this.validateCartOption(
          {
            categorySizeId: cartItem.categorySizeId,
            note: cartItem.note,
            productId: cartItem.productId,
            toppingIds,
          },
          manager,
        );

        const price = this.toNumber(option.product.price);
        const sizeExtraPrice = this.toNumber(option.categorySize.extraPrice);
        const orderItemToppings = (cartItem.cartItemToppings ?? []).map(
          (cartTopping) => ({
            price: this.toNumber(cartTopping.topping.price),
            quantity: cartItem.quantity,
            toppingId: cartTopping.topping.id,
            toppingName: cartTopping.topping.name,
          }),
        );
        const toppingsUnitTotal = orderItemToppings.reduce(
          (sum, topping) => sum + topping.price,
          0,
        );
        const lineSubtotal =
          (price + sizeExtraPrice + toppingsUnitTotal) * cartItem.quantity;
        subtotalAmount += lineSubtotal;

        orderItemSnapshots.push({
          categorySizeId: option.categorySize.id,
          note: option.note || null,
          orderItemToppings,
          price,
          productId: option.product.id,
          productName: option.product.productName,
          quantity: cartItem.quantity,
          sizeCode: option.categorySize.size.code,
          sizeExtraPrice,
          sizeName: option.categorySize.size.name,
          subtotal: lineSubtotal,
        });
      }

      // shippingFee: optional client value (Min 0). Server does not compute
      // delivery fee yet; FE can send 0 until pricing rules land.
      const shippingFee = dto.shippingFee ?? 0;
      const discountAmount = 0;
      const totalAmount = subtotalAmount + shippingFee;

      const order = await this.ordersService.createFromSnapshots(
        user,
        manager,
        {
          addressId: dto.addressId,
          discountAmount,
          note: dto.note,
          orderItems: orderItemSnapshots,
          orderType: dto.orderType,
          paymentMethod: dto.paymentMethod,
          shippingFee,
          subtotalAmount,
          totalAmount,
        },
      );

      await manager.delete(CartItems, {
        cartId: cart.id,
        id: In(cartItemIds),
      });

      return order;
    });
  }

  private async getOrCreateCart(userId: number, manager?: EntityManager) {
    const repository = manager?.getRepository(Carts) ?? this.cartsRepository;
    let cart = await repository.findOne({ where: { userId } });

    if (!cart) {
      cart = await repository.save(repository.create({ userId }));
    }

    return cart;
  }

  private async validateCartOption(
    option: {
      categorySizeId: number;
      note?: string | null;
      productId: number;
      toppingIds?: number[];
    },
    manager: EntityManager,
  ): Promise<NormalizedCartOption> {
    const product = await manager.findOne(Products, {
      where: { id: option.productId },
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new BadRequestException('Product is not available');
    }

    const categorySize = await manager.findOne(CategorySizes, {
      where: { id: option.categorySizeId },
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

    const toppingIds = [...new Set(option.toppingIds ?? [])].sort(
      (a, b) => a - b,
    );

    if (toppingIds.length > 0) {
      const categoryToppings = await manager.find(CategoryToppings, {
        where: {
          categoryId: product.categoryId,
          toppingId: In(toppingIds),
        },
      });

      if (categoryToppings.length !== toppingIds.length) {
        throw new BadRequestException(
          'One or more toppings do not match product category',
        );
      }
    }

    return {
      categorySize,
      note: (option.note ?? '').trim(),
      product,
      toppingIds,
    };
  }

  private async findMatchingItem(
    cartId: number,
    productId: number,
    categorySizeId: number,
    note: string,
    toppingIds: number[],
    manager: EntityManager,
    excludeItemId?: number,
  ) {
    const items = await manager.find(CartItems, {
      where: { cartId, categorySizeId, productId },
      relations: ['cartItemToppings'],
    });

    return items.find((item) => {
      if (excludeItemId && item.id === excludeItemId) return false;
      if ((item.note ?? '') !== note) return false;

      const itemToppingIds = item.cartItemToppings
        .map((topping) => topping.toppingId)
        .sort((a, b) => a - b);

      return this.sameNumberArray(itemToppingIds, toppingIds);
    });
  }

  private async replaceItemToppings(
    cartItemId: number,
    toppingIds: number[],
    manager: EntityManager,
  ) {
    await manager.delete(CartItemToppings, { cartItemId });

    if (toppingIds.length === 0) return;

    await manager.save(
      CartItemToppings,
      toppingIds.map((toppingId) =>
        manager.create(CartItemToppings, { cartItemId, toppingId }),
      ),
    );
  }

  private async toCartResponse(cartId: number, manager?: EntityManager) {
    const repository = manager?.getRepository(Carts) ?? this.cartsRepository;
    const cart = await repository.findOne({
      where: { id: cartId },
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.categorySize',
        'cartItems.categorySize.size',
        'cartItems.cartItemToppings',
        'cartItems.cartItemToppings.topping',
      ],
      order: { cartItems: { id: 'ASC' } },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const items = (cart.cartItems ?? []).map((item) => {
      const productPrice = this.toNumber(item.product.price);
      const sizeExtraPrice = this.toNumber(item.categorySize.extraPrice);
      const toppings = (item.cartItemToppings ?? []).map((cartTopping) => ({
        id: cartTopping.topping.id,
        name: cartTopping.topping.name,
        price: this.toNumber(cartTopping.topping.price),
      }));
      const toppingsTotal = toppings.reduce(
        (sum, topping) => sum + topping.price,
        0,
      );
      const linePrice = productPrice + sizeExtraPrice + toppingsTotal;

      return {
        id: item.id,
        key: String(item.id),
        categorySizeId: item.categorySizeId,
        linePrice,
        note: item.note ?? '',
        product: {
          categoryId: item.product.categoryId,
          desc: item.product.description,
          id: item.product.id,
          image: item.product.imageUrl,
          name: item.product.productName,
          price: productPrice,
        },
        quantity: item.quantity,
        size: item.categorySize.size.name,
        sizeCode: item.categorySize.size.code,
        sizeExtraPrice,
        toppings,
      };
    });
    const subtotal = items.reduce(
      (sum, item) => sum + item.linePrice * item.quantity,
      0,
    );

    return {
      id: cart.id,
      cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
      subtotal,
      userId: cart.userId,
    };
  }

  private sameNumberArray(left: number[], right: number[]) {
    if (left.length !== right.length) return false;
    return left.every((value, index) => value === right[index]);
  }

  private toNumber(value: number | string) {
    return Number(value ?? 0);
  }
}
