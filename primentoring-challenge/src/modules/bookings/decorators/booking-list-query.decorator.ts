import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export function ApiBookingListQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      enum: BookingStatus,
      required: false,
      description: 'Filter bookings by status',
    }),
    ApiQuery({
      name: 'order',
      enum: ['ASC', 'DESC'],
      required: false,
      description: 'Sort order for bookings',
    }),
    ApiQuery({
      name: 'page',
      default: 1,
      required: false,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      default: 10,
      required: false,
      description: 'Number of items per page',
    }),
  );
}
