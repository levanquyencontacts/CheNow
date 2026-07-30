import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entities';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfileResponse } from '../../common/types/user-response.type';
import { RoleCode } from '../../common/enums/common.enum';

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

  async create(user: Partial<Users>): Promise<Users> {
    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    const newUser = this.usersRepository.create({
      ...user,
      email: this.normalizeEmail(user.email ?? ''),
    });
    const hashedPassword = bcryptService.hashSync(user.password, 10);
    newUser.password = hashedPassword;
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.rethrowEmailConflict(error);
    }
  }

  findByEmail(email: string, includePassword = false) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', {
        email: this.normalizeEmail(email),
      });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  findProfileById(id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRole', 'userRole')
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
    const normalizedProfile = {
      ...profile,
      ...(profile.email
        ? { email: this.normalizeEmail(profile.email) }
        : undefined),
    };
    try {
      await this.usersRepository.update(id, normalizedProfile);
    } catch (error) {
      this.rethrowEmailConflict(error);
    }

    const user = await this.findProfileById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toProfileResponse(user);
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await this.usersRepository.update(id, { password: passwordHash });
  }

  async findAllForAdmin(page = 1, limit = 20, searchValue = '') {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRole', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .orderBy('user.createdAt', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (searchValue.trim()) {
      query.where(
        "(LOWER(user.email) LIKE :search OR LOWER(COALESCE(user.fullName, '')) LIKE :search)",
        { search: `%${searchValue.trim().toLowerCase()}%` },
      );
    }

    const [users, total] = await query.getManyAndCount();
    return {
      data: users.map((user) => this.toProfileResponse(user)),
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  toProfileResponse(user: Users): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? null,
      phone: user.phone ?? null,
      isActive: user.isActive,
      avatar: user.avatar ?? null,
      role: {
        id: user.userRole.role.id,
        code: user.userRole.role.code,
        name: user.userRole.role.name,
      },
      customerProfile:
        user.userRole.role.code === RoleCode.CUSTOMER && user.customerProfile
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

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private rethrowEmailConflict(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === '23505'
    ) {
      throw new ConflictException('Email already exists');
    }
    throw error;
  }
}
