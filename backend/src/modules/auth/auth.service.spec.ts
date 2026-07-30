import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { RoleCode } from '../../common/enums/common.enum';
import { Users } from '../users/users.entities';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshToken } from './refresh-token.entity';

describe('AuthService login validation', () => {
  function createService() {
    const usersService = {
      findByEmail: jest.fn(),
      validateUser: jest.fn(),
      findProfileById: jest.fn(),
    } as unknown as UsersService;
    const service = new AuthService(
      usersService,
      {} as JwtService,
      {} as Repository<RefreshToken>,
      {} as DataSource,
    );

    return {
      service,
      mocks: usersService as unknown as {
        findByEmail: jest.Mock;
        validateUser: jest.Mock;
        findProfileById: jest.Mock;
      },
    };
  }

  it('rejects an inactive user before issuing tokens', async () => {
    const { service, mocks } = createService();
    mocks.findByEmail.mockResolvedValue({
      id: 1,
      isActive: false,
    });

    await expect(
      service.validateUser('inactive@example.com', 'password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(mocks.validateUser).not.toHaveBeenCalled();
  });

  it('rejects a user that has no current role', async () => {
    const { service, mocks } = createService();
    const user = { id: 1, isActive: true } as Users;
    mocks.findByEmail.mockResolvedValue(user);
    mocks.validateUser.mockResolvedValue(user);
    mocks.findProfileById.mockResolvedValue(user);

    await expect(
      service.validateUser('missing-role@example.com', 'password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts an active user with exactly one role', async () => {
    const { service, mocks } = createService();
    const user = {
      id: 1,
      isActive: true,
      userRole: { role: { code: RoleCode.CUSTOMER } },
    } as Users;
    mocks.findByEmail.mockResolvedValue(user);
    mocks.validateUser.mockResolvedValue(user);
    mocks.findProfileById.mockResolvedValue(user);

    await expect(
      service.validateUser('customer@example.com', 'password'),
    ).resolves.toBe(user);
  });
});
