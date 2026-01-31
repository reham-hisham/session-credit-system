import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiCreditTransactionListQueries } from './decorators/credit-transaction-list-query.decorator';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PurchaseCreditsDto } from './dto/purchase-credits.dto';
import { CreditPackageService } from './creditPackage/credit-package.service';
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception';
import { UserCreditService } from './userCredit/user-credit.service';
import { CreditPackage } from './creditPackage/entity/credit-package.entity';
import { CreditTransactionService } from './creditTransaction/credit-transaction.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateCreditPackageDto } from './creditPackage/dto/create-credit-package.dto';

@ApiTags('credits')
@ApiBearerAuth('JWT')
@Controller('credits')
export class CreditsController {
  constructor(
    private readonly creditPackageService: CreditPackageService,
    private readonly userCreditsService: UserCreditService,
    private readonly creditTransactionService: CreditTransactionService,
  ) {}

  @Post('/purchase')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBody({ type: PurchaseCreditsDto })
  async purchaseCredits(
    @Body() dto: PurchaseCreditsDto,
    @Req() req: any,
  ): Promise<{ balance: number }> {
    const userId = req.user.id;
    const pkg = await this.creditPackageService.getById(dto.packageId);
    if (!pkg) {
      throw new EntityNotFoundException('CreditPackage', dto.packageId);
    }
    let userCredit = await this.userCreditsService.findByUserId(userId);
    if (!userCredit) {
      userCredit = await this.userCreditsService.create({
        userId: userId,
        creditBalance: 0,
        totalPurchased: 0,
        totalUsed: 0,
      });
    }
    // Update user credits
    userCredit.creditBalance += pkg.credits;
    userCredit.totalPurchased += pkg.credits;
    await this.userCreditsService.save(userCredit);
    return { balance: userCredit.creditBalance };
  }
  @Get('/balance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  async getBalance(@Req() req: any): Promise<{ balance: number }> {
    const userId = req.user.id;
    const userCredit = await this.userCreditsService.findByUserId(userId);
    if (!userCredit) {
      await this.userCreditsService.create({
        userId: userId,
        creditBalance: 0,
        totalPurchased: 0,
        totalUsed: 0,
      });
      return { balance: 0 };
    }
    return { balance: userCredit.creditBalance };
  }

  @Get('/transactions')
  @ApiCreditTransactionListQueries()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  async getTransactions(
    @Req() req: any,
    @Query('type') type?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const userId = req.user?.id;
    return await this.creditTransactionService.getByUserId(
      userId,
      page,
      limit,
      type as any,
      order,
    );
  }
}
