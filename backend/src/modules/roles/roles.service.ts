import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleCode } from '../../common/enums/common.enum';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';

const DEFAULT_ROLES: Array<Pick<Role, 'code' | 'name'>> = [
  { code: RoleCode.ADMIN, name: 'Quan tri vien' },
  { code: RoleCode.STAFF, name: 'Nhan vien' },
  { code: RoleCode.CUSTOMER, name: 'Khach hang' },
];

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultRoles();
  }

  async seedDefaultRoles(): Promise<void> {
    for (const role of DEFAULT_ROLES) {
      const existingRole = await this.rolesRepository.findOneBy({
        code: role.code,
      });

      if (!existingRole) {
        await this.rolesRepository.save(this.rolesRepository.create(role));
      }
    }
  }

  async assignRoleToUser(userId: number, code: RoleCode): Promise<void> {
    const role = await this.rolesRepository.findOneBy({ code });

    if (!role) {
      return;
    }

    const existingUserRole = await this.userRolesRepository.findOneBy({
      userId,
      roleId: role.id,
    });

    if (existingUserRole) {
      return;
    }

    await this.userRolesRepository.save(
      this.userRolesRepository.create({
        userId,
        roleId: role.id,
      }),
    );
  }
}
