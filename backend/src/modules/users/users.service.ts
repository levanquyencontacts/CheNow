import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfileResponse } from '../../common/types/user-response.type';

const bcryptService = bcrypt as unknown as {
  hashSync(password: string, saltRounds: number): string;
  compareSync(password: string, hash: string): boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  create(user: Partial<Users>): Promise<Users> {
    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    const newUser = this.usersRepository.create(user);
    const hashedPassword = bcryptService.hashSync(user.password, 10);
    newUser.password = hashedPassword;
    return this.usersRepository.save(newUser);
  }

  findByEmail(email: string, includePassword = false) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  findProfileById(id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .where('user.id = :id', { id })
      .getOne();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email, true);
    if (!user) {
      return null;
    }
    const status = bcryptService.compareSync(password, user.password);

    if (status) {
      return user;
    }
    return null;
  }

  async getMe(id: number) {
    const user = await this.findProfileById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toProfileResponse(user);
  }

  async updateProfile(
    id: number,
    profile: Pick<Partial<Users>, 'email' | 'fullName' | 'phone' | 'avatar'>,
  ) {
    await this.usersRepository.update(id, profile);

    const user = await this.findProfileById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toProfileResponse(user);
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await this.usersRepository.update(id, { password: passwordHash });
  }

  toProfileResponse(user: Users): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? null,
      phone: user.phone ?? null,
      isActive: user.isActive,
      avatar: user.avatar ?? null,
      userRoles:
        user.userRoles?.map((userRole) => ({
          id: userRole.role.id,
          code: userRole.role.code,
          name: userRole.role.name,
        })) ?? [],
      customerProfile: user.customerProfile
        ? {
            id: user.customerProfile.id,
            gender: user.customerProfile.gender ?? null,
            points: user.customerProfile.points,
            rank: user.customerProfile.rank,
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
