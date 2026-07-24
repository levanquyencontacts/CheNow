import { NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Users } from '../users/users.entities';
import { AddressesService } from './addresses.service';
import { UserAddress } from './entity/user-address.entity';

describe('AddressesService', () => {
  let service: AddressesService;
  let manager: {
    count: jest.Mock;
    create: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
  };

  const user = { id: 7 } as Users;
  const payload = {
    label: 'Home',
    receiverName: 'Nguyen Van A',
    receiverPhone: '0900000000',
    fullAddress: '12 Hang Bai, Hoan Kiem, Ha Noi',
  };

  beforeEach(() => {
    manager = {
      count: jest.fn(),
      create: jest.fn((_entity: unknown, value: unknown): unknown => value),
      findOne: jest.fn(),
      remove: jest.fn(),
      save: jest.fn((_entity: unknown, value: unknown): unknown => value),
      update: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn((work: (entityManager: EntityManager) => unknown) =>
        work(manager as unknown as EntityManager),
      ),
    };

    service = new AddressesService(
      {} as Repository<UserAddress>,
      dataSource as unknown as DataSource,
    );
    manager.findOne.mockResolvedValueOnce(user);
  });

  it('automatically makes the first address default', async () => {
    manager.count.mockResolvedValue(0);

    const result = await service.create(user.id, payload);

    expect(result).toEqual(
      expect.objectContaining({ isDefault: true, userId: user.id }),
    );
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('unsets the old default when a new address is explicitly default', async () => {
    manager.count.mockResolvedValue(2);

    await service.create(user.id, { ...payload, isDefault: true });

    expect(manager.update).toHaveBeenCalledWith(
      UserAddress,
      { userId: user.id },
      { isDefault: false },
    );
    expect(manager.save).toHaveBeenCalledWith(
      UserAddress,
      expect.objectContaining({ isDefault: true, userId: user.id }),
    );
  });

  it('rejects updating an address owned by another user', async () => {
    manager.findOne.mockResolvedValueOnce(null);

    await expect(
      service.update(user.id, 99, { label: 'Office' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('checks ownership and atomically switches the default address', async () => {
    const address = {
      id: 3,
      userId: user.id,
      isDefault: false,
    } as UserAddress;
    manager.findOne.mockResolvedValueOnce(address);

    const result = await service.setDefault(user.id, address.id);

    expect(manager.findOne).toHaveBeenLastCalledWith(UserAddress, {
      where: { id: address.id, userId: user.id },
      lock: { mode: 'pessimistic_write' },
    });
    expect(manager.update).toHaveBeenCalledWith(
      UserAddress,
      { userId: user.id },
      { isDefault: false },
    );
    expect(result.isDefault).toBe(true);
  });

  it('promotes the oldest remaining address after deleting the default', async () => {
    const deleted = {
      id: 1,
      userId: user.id,
      isDefault: true,
    } as UserAddress;
    const replacement = {
      id: 2,
      userId: user.id,
      isDefault: false,
    } as UserAddress;
    manager.findOne
      .mockResolvedValueOnce(deleted)
      .mockResolvedValueOnce(replacement);

    const result = await service.remove(user.id, deleted.id);

    expect(manager.remove).toHaveBeenCalledWith(UserAddress, deleted);
    expect(manager.findOne).toHaveBeenLastCalledWith(UserAddress, {
      where: { userId: user.id },
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    expect(replacement.isDefault).toBe(true);
    expect(result.defaultAddressId).toBe(replacement.id);
  });

  it('leaves no default after deleting the only address', async () => {
    const deleted = {
      id: 1,
      userId: user.id,
      isDefault: true,
    } as UserAddress;
    manager.findOne.mockResolvedValueOnce(deleted).mockResolvedValueOnce(null);

    await expect(service.remove(user.id, deleted.id)).resolves.toEqual({
      message: 'Address deleted',
      defaultAddressId: null,
    });
  });
});
