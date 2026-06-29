import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerProfile } from './entities/customer-profile.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerProfile)
    private readonly customerProfilesRepository: Repository<CustomerProfile>,
  ) {}

  async createProfileForUser(userId: number): Promise<CustomerProfile> {
    const existingProfile = await this.customerProfilesRepository.findOneBy({
      userId,
    });

    if (existingProfile) {
      return existingProfile;
    }

    return this.customerProfilesRepository.save(
      this.customerProfilesRepository.create({ userId }),
    );
  }
}
