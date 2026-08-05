import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Users } from '../users/users.entities';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { UserAddress } from './entity/user-address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly addressesRepository: Repository<UserAddress>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(userId: number) {
    return this.addressesRepository.find({
      where: { userId },
      order: { id: 'ASC' },
    });
  }

  create(userId: number, payload: CreateAddressDto) {
    return this.withUserLock(userId, async (manager) => {
      const addressCount = await manager.count(UserAddress, {
        where: { userId },
      });
      const isDefault = addressCount === 0 || payload.isDefault === true;

      if (isDefault && addressCount > 0) {
        await manager.update(UserAddress, { userId }, { isDefault: false });
      }

      return manager.save(
        UserAddress,
        manager.create(UserAddress, {
          ...payload,
          isDefault,
          userId,
        }),
      );
    });
  }

  update(userId: number, addressId: number, payload: UpdateAddressDto) {
    return this.withUserLock(userId, async (manager) => {
      const address = await this.findOwned(manager, userId, addressId);
      Object.assign(address, payload);
      return manager.save(UserAddress, address);
    });
  }

  setDefault(userId: number, addressId: number) {
    return this.withUserLock(userId, async (manager) => {
      const address = await this.findOwned(manager, userId, addressId);

      if (address.isDefault) {
        return address;
      }

      await manager.update(UserAddress, { userId }, { isDefault: false });
      address.isDefault = true;
      return manager.save(UserAddress, address);
    });
  }

  remove(userId: number, addressId: number) {
    return this.withUserLock(userId, async (manager) => {
      const address = await this.findOwned(manager, userId, addressId);
      const wasDefault = address.isDefault;
      await manager.remove(UserAddress, address);

      let defaultAddressId: number | null = null;
      if (wasDefault) {
        const replacement = await manager.findOne(UserAddress, {
          where: { userId },
          order: { createdAt: 'ASC', id: 'ASC' },
        });

        if (replacement) {
          replacement.isDefault = true;
          await manager.save(UserAddress, replacement);
          defaultAddressId = replacement.id;
        }
      }

      return {
        message: 'Address deleted',
        defaultAddressId,
      };
    });
  }

  private async findOwned(
    manager: EntityManager,
    userId: number,
    addressId: number,
  ) {
    const address = await manager.findOne(UserAddress, {
      where: { id: addressId, userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  private async withUserLock<T>(
    userId: number,
    work: (manager: EntityManager) => Promise<T>,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(Users, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return work(manager);
    });
  }
}
