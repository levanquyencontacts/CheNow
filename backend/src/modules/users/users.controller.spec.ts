import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  it('should be defined', () => {
    expect(new UsersController({} as UsersService)).toBeDefined();
  });
});
