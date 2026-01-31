import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingAggregatorService } from './booking-aggregator.service';
import { BookingRepositoryService } from './repositories/booking.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { CreditsModule } from '../credits/credits.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), CreditsModule, UsersModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingAggregatorService,
    BookingRepositoryService,
  ],
})
export class BookingsModule {}
