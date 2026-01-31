import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends Error {
  code?: string = 'INVALID_CREDENTIALS';
  statusCode = HttpStatus.UNAUTHORIZED;
  constructor(code?: string) {
    super('Email or password is incorrect');
    this.code = code ? code : this.code;
  }
}
