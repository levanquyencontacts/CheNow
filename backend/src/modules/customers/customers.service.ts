import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  UpdateUserProfileInput,
  UpsertUserAddressInput,
} from '../../common/interfaces';
import { CustomerRank, UserRole } from '../../common/enums/common.enum';
import { CustomerProfile, Users } from '../users/entity/users.entity';
import { UserAddress } from '../user-addresses/entity/user-address.entity';
import { PaginationHelper } from '../../common/helpers/pagination.helper';
import type { PaginationParamsDto } from '../../common/dtos/request.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(CustomerProfile)
    private readonly customerProfilesRepository: Repository<CustomerProfile>,
    @InjectRepository(UserAddress)
    private readonly userAddressesRepository: Repository<UserAddress>,
  ) {}

  async getCustomers(params: PaginationParamsDto) {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.userRoles', 'userRole')
      .innerJoin('userRole.role', 'role')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .where('role.code = :role', { role: UserRole.CUSTOMER })
      .select([
        'user.id',
        'user.email',
        'user.fullName',
        'user.phone',
        'user.avatar',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'customerProfile.id',
        'customerProfile.avatar',
        'customerProfile.birthday',
        'customerProfile.gender',
        'customerProfile.points',
        'customerProfile.rank',
      ]);

    return PaginationHelper.paginate(
      qb,
      params,
      ['id', 'email', 'fullName', 'createdAt'],
      'id',
      ['email', 'fullName', 'phone'],
      'user',
    );
  }

  async getCustomerProfile(userId: number) {
    await this.ensureCustomer(userId);

    let customerProfile = await this.customerProfilesRepository.findOneBy({
      userId,
    });

    if (!customerProfile) {
      customerProfile = await this.customerProfilesRepository.save(
        this.customerProfilesRepository.create({
          userId,
          points: 0,
          rank: CustomerRank.BRONZE,
        }),
      );
    }

    return customerProfile;
  }

  async updateProfile(userId: number, profile: UpdateUserProfileInput) {
    await this.ensureCustomer(userId);

    await this.usersRepository.manager.transaction(async (manager) => {
      const userFields: Partial<Users> = {};

      if (profile.email !== undefined) {
        userFields.email = profile.email;
      }
      if (profile.fullName !== undefined) {
        userFields.fullName = profile.fullName;
      }
      if (profile.phone !== undefined) {
        userFields.phone = profile.phone;
      }
      if (profile.avatar !== undefined) {
        userFields.avatar = profile.avatar;
      }

      if (Object.keys(userFields).length > 0) {
        await manager.update(Users, userId, userFields);
      }

      let customerProfile = await manager.findOneBy(CustomerProfile, {
        userId,
      });

      if (!customerProfile) {
        customerProfile = manager.create(CustomerProfile, {
          userId,
          points: 0,
          rank: CustomerRank.BRONZE,
        });
      }

      if (profile.avatar !== undefined) {
        customerProfile.avatar = profile.avatar;
      }
      if (profile.birthday !== undefined) {
        customerProfile.birthday = profile.birthday;
      }
      if (profile.gender !== undefined) {
        customerProfile.gender = profile.gender;
      }

      await manager.save(CustomerProfile, customerProfile);
    });

    return this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        customerProfile: {
          id: true,
          userId: true,
          avatar: true,
          birthday: true,
          gender: true,
          points: true,
          rank: true,
          createdAt: true,
          updatedAt: true,
        },
        userRoles: {
          id: true,
          role: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      relations: { customerProfile: true, userRoles: { role: true } },
    });
  }

  async getAddresses(userId: number) {
    await this.ensureCustomer(userId);

    return this.userAddressesRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', updatedAt: 'DESC' },
    });
  }

  async createAddress(userId: number, input: UpsertUserAddressInput) {
    await this.ensureCustomer(userId);

    return this.userAddressesRepository.manager.transaction(async (manager) => {
      if (input.isDefault) {
        await manager.update(UserAddress, { userId }, { isDefault: false });
      }

      const address = manager.create(UserAddress, {
        userId,
        receiverName: input.receiverName,
        receiverPhone: input.receiverPhone,
        address: input.address,
        isDefault: input.isDefault ?? false,
      });

      return manager.save(UserAddress, address);
    });
  }

  async updateAddress(
    userId: number,
    addressId: number,
    input: UpsertUserAddressInput,
  ) {
    await this.ensureCustomer(userId);
    const address = await this.findAddressForUser(userId, addressId);

    return this.userAddressesRepository.manager.transaction(async (manager) => {
      if (input.isDefault) {
        await manager.update(UserAddress, { userId }, { isDefault: false });
      }

      Object.assign(address, input);
      return manager.save(UserAddress, address);
    });
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    await this.ensureCustomer(userId);
    const address = await this.findAddressForUser(userId, addressId);
    await this.userAddressesRepository.remove(address);
  }

  async setDefaultAddress(userId: number, addressId: number) {
    await this.ensureCustomer(userId);
    await this.findAddressForUser(userId, addressId);

    return this.userAddressesRepository.manager.transaction(async (manager) => {
      await manager.update(UserAddress, { userId }, { isDefault: false });
      await manager.update(
        UserAddress,
        { id: addressId, userId },
        { isDefault: true },
      );

      return manager.findOneByOrFail(UserAddress, { id: addressId, userId });
    });
  }

  private async ensureCustomer(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { userRoles: { role: true } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasCustomerRole = user.userRoles?.some(
      (userRole) => userRole.role.code === UserRole.CUSTOMER,
    );

    if (!hasCustomerRole) {
      throw new BadRequestException('Tai khoan khong phai khach hang');
    }

    return user;
  }

  private async findAddressForUser(userId: number, addressId: number) {
    const address = await this.userAddressesRepository.findOneBy({
      id: addressId,
      userId,
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }
}
