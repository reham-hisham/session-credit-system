import { HttpStatus } from '@nestjs/common';

export class ForbiddenActionException extends Error {
  code?: string = 'FORBIDDEN_ACTION';
  statusCode = HttpStatus.FORBIDDEN;
  constructor(action: string, code?: string) {
    super(`You are not allowed to ${action}`);
    this.code = code ? code : this.code;
  }
}
