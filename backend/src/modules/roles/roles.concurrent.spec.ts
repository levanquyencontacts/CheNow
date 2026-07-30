import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { RoleCode } from '../../common/enums/common.enum';
import { Users } from '../users/users.entities';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleSessionService } from './role-session.service';
import { RolesService } from './roles.service';

describe('RolesService concurrent admin changes', () => {
  it('serializes two admins demoting each other and preserves one admin', async () => {
    const adminRole = { id: 1, code: RoleCode.ADMIN } as Role;
    const customerRole = { id: 2, code: RoleCode.CUSTOMER } as Role;
    const users = new Map<number, Users>([
      [1, { id: 1, isActive: true } as Users],
      [2, { id: 2, isActive: true } as Users],
    ]);
    const mappings = new Map<number, UserRole>([
      [1, { id: 1, userId: 1, roleId: adminRole.id } as UserRole],
      [2, { id: 2, userId: 2, roleId: adminRole.id } as UserRole],
    ]);
    let lockTail = Promise.resolve();

    const dataSource = {
      transaction: jest.fn(
        async (callback: (manager: EntityManager) => Promise<unknown>) => {
          let releaseLock: (() => void) | undefined;
          const manager = {
            createQueryBuilder: jest.fn((entity: unknown) => {
              let selectedIds: number[] = [];
              const builder = {
                setLock: jest.fn().mockReturnThis(),
                where: jest.fn(
                  (
                    _sql: string,
                    parameters?: { userIds?: number[]; roleId?: number },
                  ) => {
                    selectedIds = parameters?.userIds ?? [];
                    // Jest's recursive fluent mock is intentionally dynamic.
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return builder;
                  },
                ),
                orderBy: jest.fn().mockReturnThis(),
                getMany: jest.fn(async () => {
                  if (entity === Users) {
                    const previousLock = lockTail;
                    lockTail = new Promise<void>((resolve) => {
                      releaseLock = resolve;
                    });
                    await previousLock;
                    return selectedIds
                      .map((id) => users.get(id))
                      .filter((user): user is Users => Boolean(user));
                  }
                  return selectedIds
                    .map((id) => mappings.get(id))
                    .filter((mapping): mapping is UserRole => Boolean(mapping));
                }),
                getCount: jest.fn(() =>
                  Promise.resolve(
                    [...mappings.values()].filter(
                      (mapping) => mapping.roleId === adminRole.id,
                    ).length,
                  ),
                ),
              };
              // TypeORM's QueryBuilder surface is mocked only for methods used here.
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return builder;
            }),
            findOne: jest.fn(
              (
                entity: unknown,
                options?: {
                  where?: { code?: RoleCode; id?: number };
                },
              ) => {
                if (entity !== Role) return Promise.resolve(null);
                if (options?.where?.code === RoleCode.CUSTOMER) {
                  return Promise.resolve(customerRole);
                }
                if (
                  options?.where?.code === RoleCode.ADMIN ||
                  options?.where?.id === adminRole.id
                ) {
                  return Promise.resolve(adminRole);
                }
                if (options?.where?.id === customerRole.id) {
                  return Promise.resolve(customerRole);
                }
                return Promise.resolve(null);
              },
            ),
            findOneBy: jest.fn(() => Promise.resolve({ id: 1 })),
            create: jest.fn((_entity: unknown, value: unknown) => value),
            save: jest.fn((entity: unknown, value: unknown) => {
              if (entity === UserRole) {
                const mapping = value as UserRole;
                mappings.set(mapping.userId, mapping);
              }
              return Promise.resolve(value);
            }),
            update: jest.fn(() => Promise.resolve({ affected: 1 })),
          } as unknown as EntityManager;

          try {
            return await callback(manager);
          } finally {
            releaseLock?.();
          }
        },
      ),
    } as unknown as DataSource;
    const service = new RolesService({} as Repository<Role>, dataSource, {
      invalidateUser: jest.fn(() => Promise.resolve()),
    } as unknown as RoleSessionService);

    const results = await Promise.allSettled([
      service.changeUserRole(2, RoleCode.CUSTOMER, 1),
      service.changeUserRole(1, RoleCode.CUSTOMER, 2),
    ]);

    expect(
      results.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    const rejection = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );
    expect(
      rejection?.reason instanceof ForbiddenException ||
        rejection?.reason instanceof BadRequestException,
    ).toBe(true);
    expect(
      [...mappings.values()].filter(
        (mapping) => mapping.roleId === adminRole.id,
      ),
    ).toHaveLength(1);
  });
});
