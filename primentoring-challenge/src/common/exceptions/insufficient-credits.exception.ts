import { HttpStatus } from '@nestjs/common';

export class InsufficientCreditsException extends Error {
  code?: string = 'INSUFFICIENT_CREDITS';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(code?: string) {
    super('Insufficient credits');
    this.code = code ? code : this.code;
  }
}
