import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  it('should be defined', () => {
    const controller = new AuthController(
      {} as AuthService,
      {} as UsersService,
    );

    expect(controller).toBeDefined();
  });
});
