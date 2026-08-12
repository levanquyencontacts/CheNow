import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { ProductStatus } from '../../common/enums/common.enum';
import { CategorySizes } from '../category-sizes/entity/category-sizes.entity';
import { CategoryToppings } from '../category-topppings/entity/category-toppings.entity';
import { Products } from '../products/entity/products.entity';
import { Toppings } from '../toppings/entity/toppings.entity';

export type OrderItemInput = {
  productId: number;
  categorySizeId: number;
  quantity: number;
  toppingIds?: number[];
  note?: string | null;
};

export type OrderItemSnapshot = {
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
};

@Injectable()
export class OrderItemOptionsService {
  async validateAndBuildSnapshot(
    manager: EntityManager,
    input: OrderItemInput,
  ): Promise<OrderItemSnapshot> {
    const product = await manager.findOne(Products, {
      where: { id: input.productId },
    });
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new BadRequestException('Product is not available');
    }

    const categorySize = await manager.findOne(CategorySizes, {
      where: { id: input.categorySizeId },
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

    const toppingIds = [...new Set(input.toppingIds ?? [])].sort(
      (a, b) => a - b,
    );
    let toppings: Toppings[] = [];
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
      toppings = await manager.find(Toppings, {
        where: { id: In(toppingIds) },
      });
    }

    const price = Number(product.price ?? 0);
    const sizeExtraPrice = Number(categorySize.extraPrice ?? 0);
    const orderItemToppings = toppings.map((topping) => ({
      price: Number(topping.price ?? 0),
      quantity: input.quantity,
      toppingId: topping.id,
      toppingName: topping.name,
    }));
    const toppingsUnitTotal = orderItemToppings.reduce(
      (sum, t) => sum + t.price,
      0,
    );
    const subtotal =
      (price + sizeExtraPrice + toppingsUnitTotal) * input.quantity;

    return {
      categorySizeId: categorySize.id,
      note: (input.note ?? '').trim() || null,
      orderItemToppings,
      price,
      productId: product.id,
      productName: product.productName,
      quantity: input.quantity,
      sizeCode: categorySize.size.code,
      sizeExtraPrice,
      sizeName: categorySize.size.name,
      subtotal,
    };
  }
}
