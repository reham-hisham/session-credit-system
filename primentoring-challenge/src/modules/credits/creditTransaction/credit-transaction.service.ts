import { Injectable } from '@nestjs/common';
import { CreditTransactionRepositoryService } from './credit-transaction.repository';
import {
  CreditTransaction,
  CreditTransactionType,
} from './credit-transaction.entity';

@Injectable()
export class CreditTransactionService {
  constructor(
    private readonly creditTransactionRepository: CreditTransactionRepositoryService,
  ) {}

  async create(dto: Partial<CreditTransaction>): Promise<CreditTransaction> {
    const transaction = this.creditTransactionRepository.create(
      dto as CreditTransaction,
    );
    return await this.creditTransactionRepository.save(transaction);
  }

  async getByUserId(
    userId: string,
    page = 1,
    limit = 10,
    type?: CreditTransactionType,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const [data, total] = await this.creditTransactionRepository.getByUserId(
      userId,
      page,
      limit,
      type,
      order,
    );
    return { data, total, page, limit };
  }
}
