import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

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

  findProfileById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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

  async getMe(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    id: number,
    profile: Pick<Partial<Users>, 'email' | 'fullName' | 'phone' | 'avatar'>,
  ) {
    await this.usersRepository.update(id, profile);

    const user = await this.findProfileById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


}
