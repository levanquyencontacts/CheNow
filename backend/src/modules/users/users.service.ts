import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CustomerProfile,
  CustomerRank,
  UserRole,
  Users,
} from './entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import type {
  CreateUserInput,
  UpdateUserInput,
} from '../../common/interfaces/user.interface';
import { RolesService } from '../roles/roles.service';

const bcryptService = bcrypt as unknown as {
  hashSync(password: string, saltRounds: number): string;
  compareSync(password: string, hash: string): boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly rolesService: RolesService,
  ) {}

  async create(user: CreateUserInput): Promise<Users> {
    if (!user.password) {
      throw new BadRequestException('Mat khau la bat buoc');
    }

    const email = user.email?.trim().toLowerCase();
    if (!email) {
      throw new BadRequestException('Email la bat buoc');
    }

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email da ton tai');
    }

    const roleCodes: UserRole[] =
      Array.isArray(user.roles) && (user.roles as UserRole[]).length > 0
        ? (user.roles as UserRole[])
        : [user.role ?? UserRole.CUSTOMER];
    const newUser = this.usersRepository.create({
      email,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar ?? null,
    });
    const hashedPassword = bcryptService.hashSync(user.password, 10);
    newUser.password = hashedPassword;

    return this.usersRepository.manager.transaction(async (manager) => {
      const savedUser = await manager.save(Users, newUser);
      await this.rolesService.assignRolesToUser(
        manager,
        savedUser.id,
        roleCodes,
      );

      if (roleCodes.includes(UserRole.CUSTOMER)) {
        await manager.save(
          CustomerProfile,
          manager.create(CustomerProfile, {
            userId: savedUser.id,
            avatar: user.avatar ?? null,
            points: 0,
            rank: CustomerRank.BRONZE,
          }),
        );
      }

      return savedUser;
    });
  }

  findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({ email });
    return user;
  }

  findProfileById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
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

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
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
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        customerProfile: true,
        userRoles: { role: true },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete (user as Partial<Users>).password;

    return {
      ...user,
      roles: user.userRoles?.map((ur) => ur.role) ?? [],
      userRoles: undefined,
    };
  }

  async updateProfile(id: number, profile: UpdateUserInput) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userFields: Partial<Users> = {};

    if (profile.email !== undefined) {
      const email = profile.email.trim().toLowerCase();
      const existingUser = await this.findByEmail(email);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email da ton tai');
      }

      userFields.email = email;
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
      await this.usersRepository.update(id, userFields);
    }

    const updatedUser = await this.findProfileById(id);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await this.usersRepository.update(id, { password: passwordHash });
  }
}
