import { HttpStatus } from '@nestjs/common';

export class UserCreditNotFoundException extends Error {
  code?: string = 'USER_CREDIT_NOT_FOUND';
  statusCode = HttpStatus.NOT_FOUND;
  constructor(code?: string) {
    super('User credit not found');
    this.code = code ? code : this.code;
  }
}
