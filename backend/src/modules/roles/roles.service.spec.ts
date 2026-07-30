import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { RoleCode } from '../../common/enums/common.enum';
import { CustomerProfile } from '../customers/entities/customer-profile.entity';
import { Users } from '../users/users.entities';
import { Role } from './entities/role.entity';
import { UserRoleHistory } from './entities/user-role-history.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleSessionService } from './role-session.service';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  const actorId = 1;
  const userId = 2;
  const actorRoleId = 100;
  const currentRoleId = 20;

  function createService(options?: {
    actorActive?: boolean;
    actorRole?: RoleCode;
    currentRole?: RoleCode;
    adminCount?: number;
    customerProfile?: CustomerProfile | null;
  }) {
    const actorRole = options?.actorRole ?? RoleCode.ADMIN;
    const currentRole = options?.currentRole ?? RoleCode.STAFF;
    const current = {
      id: 10,
      userId,
      roleId: currentRoleId,
    } as UserRole;
    const actorMapping = {
      id: 11,
      userId: actorId,
      roleId: actorRoleId,
    } as UserRole;
    const targetRole = {
      id: 30,
      code: RoleCode.CUSTOMER,
    } as Role;
    const saveMock = jest.fn((_entity: unknown, value: unknown) =>
      Promise.resolve(value),
    );
    const updateMock = jest.fn(
      (entity: unknown, criteria: unknown, payload: unknown) => {
        void entity;
        void criteria;
        void payload;
        return Promise.resolve({ affected: 1 });
      },
    );
    const invalidateMock = jest.fn(() => Promise.resolve());
    const getCountMock = jest.fn(() =>
      Promise.resolve(options?.adminCount ?? 2),
    );
    const manager = {
      findOne: jest.fn((entity: unknown, findOptions?: unknown) => {
        if (entity !== Role) return Promise.resolve(null);
        const where = (
          findOptions as {
            where?: { code?: RoleCode; id?: number };
          }
        )?.where;
        if (where?.code === RoleCode.CUSTOMER) {
          return Promise.resolve(targetRole);
        }
        if (where?.code === RoleCode.ADMIN || where?.id === actorRoleId) {
          return Promise.resolve({ id: actorRoleId, code: actorRole } as Role);
        }
        if (where?.id === currentRoleId) {
          return Promise.resolve({
            id: currentRoleId,
            code: currentRole,
          } as Role);
        }
        return Promise.resolve(null);
      }),
      findOneBy: jest.fn(() =>
        Promise.resolve(options?.customerProfile ?? null),
      ),
      create: jest.fn((_entity: unknown, value: unknown) => value),
      save: saveMock,
      update: updateMock,
      createQueryBuilder: jest.fn((entity: unknown) => {
        const builder = {
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn(() => {
            if (entity === Users) {
              return Promise.resolve([
                {
                  id: actorId,
                  isActive: options?.actorActive ?? true,
                } as Users,
                { id: userId, isActive: true } as Users,
              ]);
            }
            return Promise.resolve([actorMapping, current]);
          }),
          getCount: getCountMock,
        };
        return builder;
      }),
    } as unknown as EntityManager;
    const dataSource = {
      transaction: jest.fn(
        (callback: (manager: EntityManager) => Promise<unknown>) =>
          callback(manager),
      ),
    } as unknown as DataSource;
    const sessions = {
      invalidateUser: invalidateMock,
    } as unknown as RoleSessionService;
    const service = new RolesService(
      {
        findOneBy: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      } as unknown as Repository<Role>,
      dataSource,
      sessions,
    );

    return {
      service,
      mocks: {
        count: getCountMock,
        invalidate: invalidateMock,
        save: saveMock,
        update: updateMock,
      },
    };
  }

  it('rejects an admin changing their own role', async () => {
    const { service } = createService();

    await expect(
      service.changeUserRole(actorId, RoleCode.CUSTOMER, actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('locks and revalidates the actor as an active admin in the transaction', async () => {
    const inactiveActor = createService({ actorActive: false });
    await expect(
      inactiveActor.service.changeUserRole(userId, RoleCode.CUSTOMER, actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);

    const demotedActor = createService({ actorRole: RoleCode.STAFF });
    await expect(
      demotedActor.service.changeUserRole(userId, RoleCode.CUSTOMER, actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('is idempotent when the requested role is already current', async () => {
    const { service, mocks } = createService({
      currentRole: RoleCode.CUSTOMER,
    });

    await expect(
      service.changeUserRole(userId, RoleCode.CUSTOMER, actorId),
    ).resolves.toEqual({
      oldRole: RoleCode.CUSTOMER,
      newRole: RoleCode.CUSTOMER,
    });
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });

  it('prevents demoting the last admin under the admin-role lock', async () => {
    const { service, mocks } = createService({
      currentRole: RoleCode.ADMIN,
      adminCount: 1,
    });

    await expect(
      service.changeUserRole(userId, RoleCode.CUSTOMER, actorId),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mocks.count).toHaveBeenCalledTimes(1);
  });

  it('creates a missing customer profile, audits, revokes, and invalidates', async () => {
    const { service, mocks } = createService({
      customerProfile: null,
    });

    await service.changeUserRole(userId, RoleCode.CUSTOMER, actorId);

    expect(mocks.save).toHaveBeenCalledWith(
      CustomerProfile,
      expect.objectContaining({ userId }),
    );
    expect(mocks.save).toHaveBeenCalledWith(
      UserRoleHistory,
      expect.objectContaining({ userId, actorId }),
    );
    expect(mocks.update).toHaveBeenCalled();
    expect(mocks.invalidate).toHaveBeenCalledWith(userId);
  });

  it('preserves an existing customer profile', async () => {
    const existingProfile = { id: 99, userId } as CustomerProfile;
    const { service, mocks } = createService({
      customerProfile: existingProfile,
    });

    await service.changeUserRole(userId, RoleCode.CUSTOMER, actorId);

    const customerProfileSaves = mocks.save.mock.calls.filter(
      ([entity]) => entity === CustomerProfile,
    );
    expect(customerProfileSaves).toHaveLength(0);
  });
});
