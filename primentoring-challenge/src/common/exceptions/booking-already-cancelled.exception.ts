import { HttpStatus } from '@nestjs/common';

export class BookingAlreadyCancelledException extends Error {
  code?: string = 'BOOKING_ALREADY_CANCELLED';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(code?: string) {
    super('Booking already cancelled');
    this.code = code ? code : this.code;
  }
}
