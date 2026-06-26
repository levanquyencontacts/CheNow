import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserRole } from '../../common/enums/common.enum';
import { Role, UserRoleEntity } from './entity/role.entity';

@Injectable()
export class RolesService {
  async assignRolesToUser(
    manager: EntityManager,
    userId: number,
    roleCodes: UserRole[],
  ): Promise<void> {
    const uniqueRoleCodes = [...new Set(roleCodes)];
    const roles = await Promise.all(
      uniqueRoleCodes.map((roleCode) =>
        this.getOrCreateRole(manager, roleCode),
      ),
    );

    await manager.save(
      UserRoleEntity,
      roles.map((role) =>
        manager.create(UserRoleEntity, {
          userId,
          roleId: role.id,
        }),
      ),
    );
  }

  private async getOrCreateRole(manager: EntityManager, code: UserRole) {
    const existingRole = await manager.findOneBy(Role, { code });

    if (existingRole) {
      return existingRole;
    }

    return manager.save(
      Role,
      manager.create(Role, {
        code,
        name: this.getRoleName(code),
        description: null,
      }),
    );
  }

  private getRoleName(code: UserRole): string {
    const names: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Quan tri vien',
      [UserRole.CUSTOMER]: 'Khach hang',
    };

    return names[code];
  }
}
