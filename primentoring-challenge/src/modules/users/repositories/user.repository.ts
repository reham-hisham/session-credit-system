import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    return this.repo.create(data);
  }

  async save(entity: User) {
    return await this.repo.save(entity);
  }

  async update(id: string, data: Partial<User>) {
    return await this.repo.update(id, data);
  }

  async remove(entity: User) {
    return await this.repo.remove(entity);
  }
  async findWithEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }
}
