import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepositoryService } from './repositories/booking.repository';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingRepo: BookingRepositoryService) {}

  async create(data: Partial<Booking>) {
    const booking = this.bookingRepo.create(data);
    return this.bookingRepo.save(booking);
  }

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
    order?: 'ASC' | 'DESC',
  ) {
    const [data, total] = await this.bookingRepo.findAllByUser(
      userId,
      page,
      limit,
      status,
      order,
    );
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const booking = await this.bookingRepo.findOne(id);
    return booking;
  }

  async findScheduledBookingByMentorAndTime(
    mentorId: string,
    scheduledAt: Date,
    endDate: Date,
  ) {
    // Check for overlapping bookings
    const bookings =
      await this.bookingRepo.findScheduledBookingByMentorAndwithinTime(
        mentorId,
        scheduledAt,
        endDate,
        [
          BookingStatus.COMPLETED,
          BookingStatus.CONFIRMED,
          BookingStatus.PENDING,
        ],
      );
    // Return the first overlapping booking if any exist
    return bookings.length > 0 ? bookings[0] : null;
  }

  async update(id: string, updateData: Partial<Booking>) {
    await this.bookingRepo.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string) {
    const booking = await this.findOne(id);
    await this.bookingRepo.delete(id);
    return booking;
  }
}
