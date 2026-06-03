import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  create(user: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    newUser.password = hashedPassword;
    return this.usersRepository.save(newUser);
  }
  findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({ email });
    return user;
  }
  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const status = bcrypt.compareSync(password, user.password);

    if (status) {
      return user;
    }
    return null;
  }
}
