import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { RoleCode } from '../../common/enums/common.enum';
import { RefreshToken } from '../auth/refresh-token.entity';
import { CustomerProfile } from '../customers/entities/customer-profile.entity';
import { Users } from '../users/users.entities';
import { Role } from './entities/role.entity';
import { UserRoleHistory } from './entities/user-role-history.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleSessionService } from './role-session.service';

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
    private readonly dataSource: DataSource,
    private readonly roleSessionService: RoleSessionService,
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

  async changeUserRole(
    userId: number,
    code: RoleCode,
    actorId: number,
  ): Promise<{ oldRole: RoleCode | null; newRole: RoleCode }> {
    if (userId === actorId) {
      throw new ForbiddenException('Admins cannot change their own role');
    }

    const result = await this.dataSource.transaction(async (manager) => {
      const lockedUsers = await manager
        .createQueryBuilder(Users, 'user')
        .setLock('pessimistic_write')
        .where('user.id IN (:...userIds)', {
          userIds: [actorId, userId].sort((left, right) => left - right),
        })
        .orderBy('user.id', 'ASC')
        .getMany();
      const user = lockedUsers.find((candidate) => candidate.id === userId);
      const actor = lockedUsers.find((candidate) => candidate.id === actorId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!actor?.isActive) {
        throw new ForbiddenException('Actor is not an active admin');
      }

      const lockedMappings = await manager
        .createQueryBuilder(UserRole, 'userRole')
        .setLock('pessimistic_write')
        .where('userRole.userId IN (:...userIds)', {
          userIds: [actorId, userId].sort((left, right) => left - right),
        })
        .orderBy('userRole.userId', 'ASC')
        .getMany();
      const actorMapping = lockedMappings.find(
        (mapping) => mapping.userId === actorId,
      );
      const current = lockedMappings.find(
        (mapping) => mapping.userId === userId,
      );
      const actorRole = actorMapping
        ? await manager.findOne(Role, {
            where: { id: actorMapping.roleId },
          })
        : null;
      if (actorRole?.code !== RoleCode.ADMIN) {
        throw new ForbiddenException('Actor is not an active admin');
      }

      const role = await manager.findOne(Role, { where: { code } });
      if (!role) {
        throw new BadRequestException(`Role ${code} does not exist`);
      }

      const oldRoleId = current?.roleId ?? null;
      const currentRole = oldRoleId
        ? await manager.findOne(Role, { where: { id: oldRoleId } })
        : null;
      const oldRole = currentRole?.code ?? null;

      if (oldRole === code) {
        return { oldRole, newRole: code, changed: false };
      }

      if (oldRole === RoleCode.ADMIN) {
        const adminRole = await manager.findOne(Role, {
          where: { code: RoleCode.ADMIN },
          lock: { mode: 'pessimistic_write' },
        });
        if (!adminRole) {
          throw new BadRequestException('Admin role does not exist');
        }
        const adminCount = await manager
          .createQueryBuilder(UserRole, 'userRole')
          .where('userRole.roleId = :roleId', { roleId: adminRole.id })
          .getCount();
        if (adminCount <= 1) {
          throw new BadRequestException('Cannot demote the last admin');
        }
      }

      const mapping =
        current ??
        manager.create(UserRole, {
          userId,
          roleId: role.id,
        });
      mapping.roleId = role.id;
      await manager.save(UserRole, mapping);

      if (code === RoleCode.CUSTOMER) {
        const profile = await manager.findOneBy(CustomerProfile, { userId });
        if (!profile) {
          await manager.save(
            CustomerProfile,
            manager.create(CustomerProfile, { userId }),
          );
        }
      }

      await manager.save(
        UserRoleHistory,
        manager.create(UserRoleHistory, {
          userId,
          actorId,
          oldRoleId,
          newRoleId: role.id,
        }),
      );
      await manager.update(
        RefreshToken,
        { userId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );

      return { oldRole, newRole: code, changed: true };
    });

    if (result.changed) {
      await this.roleSessionService.invalidateUser(userId);
    }

    return { oldRole: result.oldRole, newRole: result.newRole };
  }
}
