import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class BookingRepositoryService {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
  ) {}

  findScheduledBookingByMentorAndwithinTime(
    mentorId: string,
    scheduledAt: Date,
    endDate: Date,
    statusArray: BookingStatus[],
  ) {
    return this.repo.find({
      where: {
        mentorId,
        status: In(statusArray),
        scheduledAt: LessThan(endDate), // existing start < new end
        endDate: MoreThan(scheduledAt), // existing end > new start
      },
    });
  }

  findAllByUser(
    userId: string,
    page: number,
    limit: number,
    status?: BookingStatus,
    order?: 'ASC' | 'DESC',
  ) {
    const whereConditions: any[] = [{ menteeId: userId }, { mentorId: userId }];

    if (status) {
      whereConditions[0].status = status;
      whereConditions[1].status = status;
    }

    return this.repo.findAndCount({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
      order: { scheduledAt: order || 'DESC' },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Booking>) {
    return this.repo.create(data);
  }

  save(booking: Booking) {
    return this.repo.save(booking);
  }

  update(id: string, data: Partial<Booking>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
