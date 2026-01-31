import { HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends Error {
  code?: string = 'EMAIL_ALREADY_EXISTS';
  statusCode = HttpStatus.CONFLICT;
  constructor(email: string, code?: string) {
    super(`Email already registered: ${email}`);
    this.code = code ? code : this.code;
  }
}
