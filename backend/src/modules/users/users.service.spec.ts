import { Repository } from 'typeorm';
import { Users } from './users.entities';
import { UsersService } from './users.service';

describe('UsersService', () => {
  it('should be defined', () => {
    const service = new UsersService({} as Repository<Users>);
    expect(service).toBeDefined();
  });
});
