import { HttpStatus } from '@nestjs/common';

export class CreditPackageNotFoundException extends Error {
  code?: string = 'CREDIT_PACKAGE_NOT_FOUND';
  statusCode = HttpStatus.NOT_FOUND;
  constructor(code?: string) {
    super('Credit package not found or inactive');
    this.code = code ? code : this.code;
  }
}
