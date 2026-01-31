import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreditTransaction,
  CreditTransactionType,
} from './credit-transaction.entity';

@Injectable()
export class CreditTransactionRepositoryService {
  constructor(
    @InjectRepository(CreditTransaction)
    private readonly repo: Repository<CreditTransaction>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<CreditTransaction>) {
    return this.repo.create(data);
  }

  save(entity: CreditTransaction) {
    return this.repo.save(entity);
  }

  update(id: string, data: Partial<CreditTransaction>) {
    return this.repo.update(id, data);
  }

  remove(entity: CreditTransaction) {
    return this.repo.remove(entity);
  }

  getByUserId(
    userId: string,
    page = 1,
    limit = 10,
    type?: CreditTransactionType,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    return this.repo.findAndCount({
      where,
      order: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
