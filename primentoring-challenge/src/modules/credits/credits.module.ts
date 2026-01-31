import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditsController } from './credits.controller';
import { CreditPackageController } from './credit-package.controller';
import { CreditPackage } from './creditPackage/entity/credit-package.entity';
import { CreditTransaction } from './creditTransaction/credit-transaction.entity';
import { UserCredit } from './userCredit/user-credit.entity';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../redis/redis.module';

import { CreditPackageService } from './creditPackage/credit-package.service';
import { CreditTransactionService } from './creditTransaction/credit-transaction.service';
import { UserCreditService } from './userCredit/user-credit.service';
import { CreditPackageRepositoryService } from './creditPackage/credit-package.repository';
import { CreditTransactionRepositoryService } from './creditTransaction/credit-transaction.repository';
import { UserCreditRepositoryService } from './userCredit/user-credit.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditPackage, UserCredit, CreditTransaction]),
    UsersModule,
    RedisModule,
  ],
  controllers: [CreditsController, CreditPackageController],
  providers: [
    CreditPackageService,
    CreditTransactionService,
    UserCreditService,
    CreditPackageRepositoryService,
    CreditTransactionRepositoryService,
    UserCreditRepositoryService,
  ],
  exports: [UserCreditService, CreditTransactionService],
})
export class CreditsModule {}
