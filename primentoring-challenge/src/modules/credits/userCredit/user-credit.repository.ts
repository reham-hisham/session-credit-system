import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredit } from './user-credit.entity';

@Injectable()
export class UserCreditRepositoryService {
  constructor(
    @InjectRepository(UserCredit)
    private readonly repo: Repository<UserCredit>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<UserCredit>) {
    return this.repo.create(data);
  }

  save(entity: UserCredit) {
    return this.repo.save(entity);
  }

  update(id: string, data: Partial<UserCredit>) {
    return this.repo.update(id, data);
  }

  remove(entity: UserCredit) {
    return this.repo.remove(entity);
  }

  findByUserId(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }
}
