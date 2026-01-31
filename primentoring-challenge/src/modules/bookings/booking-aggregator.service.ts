import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreditTransactionType } from '../credits/creditTransaction/credit-transaction.entity';
import { UsersService } from '../users/users.service';
import { UserCreditService } from '../credits/userCredit/user-credit.service';
import { CreditTransactionService } from '../credits/creditTransaction/credit-transaction.service';

@Injectable()
export class BookingAggregatorService {
  constructor(
    private readonly userService: UsersService,
    private readonly userCreditService: UserCreditService,
    private readonly creditTransactionService: CreditTransactionService,
  ) {}

  async findMentorById(id: string) {
    return await this.userService.findById(id);
  }

  async getBalance(userId: string): Promise<{ balance: number }> {
    const userCredit = await this.userCreditService.findByUserId(userId);
    if (!userCredit) {
      return { balance: 0 };
    }
    return { balance: userCredit.creditBalance };
  }

  async deductCredits(payload: {
    userId: string;
    amount: number;
    description: string;
    referenceId?: string;
  }) {
    const userCredit = await this.userCreditService.findByUserId(
      payload.userId,
    );
    if (!userCredit || userCredit.creditBalance < payload.amount) {
      throw new BadRequestException('Insufficient credits');
    }
    userCredit.creditBalance -= payload.amount;
    userCredit.totalUsed += payload.amount;
    await this.userCreditService.save(userCredit);
    await this.creditTransactionService.create({
      userId: payload.userId,
      amount: payload.amount,
      type: CreditTransactionType.BOOKING,
      description: payload.description,
      referenceId: payload.referenceId,
    });
    return { balance: userCredit.creditBalance };
  }

  async refundCredits(payload: {
    userId: string;
    amount: number;
    description: string;
    referenceId?: string;
  }) {
    const userCredit = await this.userCreditService.findByUserId(
      payload.userId,
    );
    if (!userCredit) {
      throw new NotFoundException('User credit record not found');
    }
    userCredit.creditBalance += payload.amount;
    userCredit.totalUsed -= payload.amount;
    await this.userCreditService.save(userCredit);
    await this.creditTransactionService.create({
      userId: payload.userId,
      amount: payload.amount,
      type: CreditTransactionType.REFUND,
      description: payload.description,
      referenceId: payload.referenceId,
    });
    return { balance: userCredit.creditBalance };
  }
}
