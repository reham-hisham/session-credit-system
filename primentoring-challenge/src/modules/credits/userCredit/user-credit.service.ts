import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreditRepositoryService } from './user-credit.repository';
import { UserCredit } from './user-credit.entity';
import { InsufficientCreditsException } from '../../../common/exceptions/insufficient-credits.exception';
import { UserCreditNotFoundException } from '../../../common/exceptions/user-credit-not-found.exception';
import { CreditTransactionService } from '../creditTransaction/credit-transaction.service';
import { UserCreditDto } from './dto/user-credit.dto';

@Injectable()
export class UserCreditService {
  constructor(
    private readonly userCreditRepository: UserCreditRepositoryService,
    private readonly creditTransactionService: CreditTransactionService,
  ) {}

  async findByUserId(userId: string): Promise<UserCredit | null> {
    return this.userCreditRepository.findByUserId(userId);
  }

  async save(credit: UserCredit): Promise<UserCredit> {
    return this.userCreditRepository.save(credit);
  }

  async create(dto: UserCreditDto): Promise<UserCredit> {
    const credit = this.userCreditRepository.create(dto as UserCredit);
    return this.userCreditRepository.save(credit);
  }
  
  async deductCredits(
    userId: string,
    amount: number,
    description: string,
  ): Promise<{ balance: number }> {
    const userCredit = await this.findByUserId(userId);
    if (!userCredit || userCredit.creditBalance < amount) {
      throw new InsufficientCreditsException();
    }
    userCredit.creditBalance -= amount;
    userCredit.totalUsed += amount;
    await this.save(userCredit);
    await this.creditTransactionService.create({
      userId,
      amount: -amount,
      description,
    });
    return { balance: userCredit.creditBalance };
  }

  async refundCredits(
    userId: string,
    amount: number,
    description: string,
  ): Promise<{ balance: number }> {
    const userCredit = await this.findByUserId(userId);
    if (!userCredit) {
      throw new UserCreditNotFoundException();
    }
    userCredit.creditBalance += amount;
    userCredit.totalUsed -= amount;
    await this.save(userCredit);
    await this.creditTransactionService.create({
      userId,
      amount,
      description,
    });
    return { balance: userCredit.creditBalance };
  }
}
