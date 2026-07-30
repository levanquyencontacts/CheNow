import { UnauthorizedException } from '@nestjs/common';
import { RoleCode } from '../common/enums/common.enum';
import { Users } from '../modules/users/users.entities';
import { UsersService } from '../modules/users/users.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy token purpose', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  const activeUser = {
    id: 1,
    isActive: true,
    userRole: { role: { code: RoleCode.CUSTOMER } },
  } as Users;

  function createStrategy(user: Users | null = activeUser) {
    const usersService = {
      findProfileById: jest.fn(() => Promise.resolve(user)),
    } as unknown as UsersService;
    return new JwtStrategy(usersService);
  }

  it.each(['password-reset', 'refresh', undefined] as const)(
    'rejects non-access token purpose %s',
    async (type) => {
      await expect(
        createStrategy().validate({ sub: 1, type }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    },
  );

  it('accepts only an access token for an active user with a role', async () => {
    await expect(
      createStrategy().validate({ sub: 1, type: 'access' }),
    ).resolves.toBe(activeUser);
  });

  it('rejects inactive users and users without a role', async () => {
    await expect(
      createStrategy({ ...activeUser, isActive: false }).validate({
        sub: 1,
        type: 'access',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      createStrategy({ id: 1, isActive: true } as Users).validate({
        sub: 1,
        type: 'access',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
