import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderType, PaymentMethod } from '../../../common/enums/common.enum';
import { CheckoutCartDto } from './cart.dto';

describe('CheckoutCartDto', () => {
  async function validatePayload(payload: Record<string, unknown>) {
    const dto = plainToInstance(CheckoutCartDto, payload);
    return validate(dto);
  }

  it('rejects empty cartItemIds', async () => {
    const errors = await validatePayload({
      cartItemIds: [],
      orderType: OrderType.TAKEAWAY,
      paymentMethod: PaymentMethod.CASH,
    });

    expect(errors.some((error) => error.property === 'cartItemIds')).toBe(true);
  });

  it('rejects duplicate cartItemIds', async () => {
    const errors = await validatePayload({
      cartItemIds: [1, 1],
      orderType: OrderType.TAKEAWAY,
      paymentMethod: PaymentMethod.CASH,
    });

    expect(errors.some((error) => error.property === 'cartItemIds')).toBe(true);
  });
});
