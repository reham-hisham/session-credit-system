import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CreditTransactionType } from '../creditTransaction/credit-transaction.entity';

export function ApiCreditTransactionListQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'type',
      enum: CreditTransactionType,
      required: false,
      description: 'Filter transactions by type (e.g. BONUS, PURCHASE, etc.)',
    }),
    ApiQuery({
      name: 'order',
      enum: ['ASC', 'DESC'],
      required: false,
      description: 'Sort order for transactions',
    }),
    ApiQuery({
      name: 'page',
      default: 1,
      required: false,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      default: 10,
      required: false,
      description: 'Number of items per page',
    }),
  );
}
