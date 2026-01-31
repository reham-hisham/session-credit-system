import { HttpStatus } from '@nestjs/common';

export class NotAMentorException extends Error {
  code?: string = 'NOT_A_MENTOR';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(code?: string) {
    super('Selected user is not a mentor');
    this.code = code ? code : this.code;
  }
}
