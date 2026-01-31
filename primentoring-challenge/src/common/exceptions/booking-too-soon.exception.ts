import { HttpStatus } from '@nestjs/common';

export class BookingTooSoonException extends Error {
  code?: string = 'BOOKING_TOO_SOON';
  statusCode = HttpStatus.BAD_REQUEST;
  constructor() {
    super('Booking must be scheduled at least 24 hours in advance');
  }
}
