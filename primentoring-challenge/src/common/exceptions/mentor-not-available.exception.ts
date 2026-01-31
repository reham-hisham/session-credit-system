import { HttpStatus } from '@nestjs/common';

export class MentorNotAvailableException extends Error {
  code?: string = 'MENTOR_NOT_AVAILABLE';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(code?: string) {
    super('Mentor is not available at this time');
    this.code = code ? code : this.code;
  }
}
