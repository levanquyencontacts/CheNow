import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
   
    findAll(): Promise<User[]> {
        return this.userRepo.find();
    }
    create(user: User): Promise<User> {
        const newUser = this.userRepo.create(user);
        return this.userRepo.save(newUser);
    }
   async find(id: number): Promise<User> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async update(id: number, user: User): Promise<User> {
    await this.userRepo.update({ id }, user);
    
  const updatedUser = await this.userRepo.findOneBy({ id });
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
        return updatedUser;
    }
    
   async delete(id: number): Promise<void> {
        await this.userRepo.delete({ id });
    }
}

    