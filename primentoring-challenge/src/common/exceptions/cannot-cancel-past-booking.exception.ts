import { HttpStatus } from '@nestjs/common';

export class CannotCancelPastBookingException extends Error {
  code?: string = 'CANNOT_CANCEL_PAST_BOOKING';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(code?: string) {
    super('Cannot cancel a booking that has already occurred');
    this.code = code ? code : this.code;
  }
}
