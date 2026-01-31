import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { ForbiddenActionException } from '../../common/exceptions/forbidden-action.exception';
import { InsufficientCreditsException } from '../../common/exceptions/insufficient-credits.exception';
import { NotAMentorException } from '../../common/exceptions/not-a-mentor.exception';
import { MentorNotAvailableException } from '../../common/exceptions/mentor-not-available.exception';
import { BookingTooSoonException } from '../../common/exceptions/booking-too-soon.exception';
import { BookingAlreadyCancelledException } from '../../common/exceptions/booking-already-cancelled.exception';
import { CannotCancelPastBookingException } from '../../common/exceptions/cannot-cancel-past-booking.exception';
import { BookingStatus } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBookingListQueries } from './decorators/booking-list-query.decorator';

import { BookingAggregatorService } from './booking-aggregator.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@ApiTags('bookings')
@ApiBearerAuth('JWT')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingAggregator: BookingAggregatorService,

    private readonly bookingsService: BookingsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBody({ type: CreateBookingDto })
  async createBooking(@Body() Payload: CreateBookingDto, @Req() req: any) {
    try {
      const userId = req.user.id;
      const mentor = await this.bookingAggregator.findMentorById(
        Payload.mentorId,
      );
      if (!mentor) {
        throw new EntityNotFoundException('Mentor');
      }
      if (mentor.role !== UserRole.MENTOR) {
        throw new NotAMentorException();
      }
      const endDate = new Date(
        new Date(Payload.scheduledAt).getTime() + Payload.duration * 60000,
      );
      const startDate = new Date(Payload.scheduledAt);
      const existingBooking =
        await this.bookingsService.findScheduledBookingByMentorAndTime(
          Payload.mentorId,
          startDate,
          endDate,
        );
      if (existingBooking) {
        throw new MentorNotAvailableException();
      }
      if (startDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000) {
        throw new BookingTooSoonException();
      }
      const balance = await this.bookingAggregator.getBalance(userId);
      const minutesPerCredit = Number(
        this.configService.get('MINUTES_PER_CREDIT'),
      );
      if (balance.balance < Payload.duration / minutesPerCredit) {
        throw new InsufficientCreditsException();
      }
      const booking = await this.bookingsService.create({
        menteeId: userId,
        mentorId: Payload.mentorId,
        scheduledAt: new Date(Payload.scheduledAt),
        status: BookingStatus.PENDING,
        creditsUsed: Payload.duration / minutesPerCredit,
        endDate: endDate,
        duration: Payload.duration,
      });
      const deductCreditPayload = {
        userId: userId,
        amount: Payload.duration / minutesPerCredit,
        description: `Booking with mentor ${mentor.name} on ${Payload.scheduledAt}`,
        referenceId: booking.id,
      };
      await this.bookingAggregator.deductCredits(deductCreditPayload);
      return booking;
    } catch (error) {
      console.error('Create booking error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'CREATE_BOOKING_ERROR',
        message: error.message || 'An error occurred during booking creation',
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiBookingListQueries()
  async listBookings(
    @Req() req: any,
    @Query('status') status?: BookingStatus,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      return await this.bookingsService.findAllByUser(
        req.user.id,
        Number(page),
        Number(limit),
        status,
        order,
      );
    } catch (error) {
      console.error('List bookings error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'LIST_BOOKINGS_ERROR',
        message: error.message || 'An error occurred while listing bookings',
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiParam({ name: 'id', type: 'string' })
  async getBookingDetails(@Req() req: any, @Param('id') id: string) {
    try {
      const booking = await this.bookingsService.findOne(id);
      if (!booking) throw new EntityNotFoundException('Booking');
      if (booking.menteeId !== req.user.id && booking.mentorId !== req.user.id)
        throw new ForbiddenActionException('access this booking');
      return booking;
    } catch (error) {
      console.error('Get booking details error:', error);
      return {
        status: error.statusCode || 404,
        code: error.code || 'GET_BOOKING_ERROR',
        message:
          error.message || 'An error occurred while fetching booking details',
      };
    }
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MENTEE)
  @ApiParam({ name: 'id', type: 'string' })
  async cancelBooking(@Req() req: any, @Param('id') id: string) {
    try {
      const userId = req.user.id;
      const booking = await this.bookingsService.findOne(id);
      if (!booking) throw new EntityNotFoundException('Booking');
      if (booking.menteeId !== userId)
        throw new ForbiddenActionException(
          'cancel this booking (only the mentee can cancel their own booking)',
        );
      if (booking.status === BookingStatus.CANCELLED)
        throw new BookingAlreadyCancelledException();
      if (booking.scheduledAt.getTime() < new Date().getTime())
        throw new CannotCancelPastBookingException();
      const hoursBefore =
        (booking.scheduledAt.getTime() - new Date().getTime()) /
        (1000 * 60 * 60);
      let refund = 0;
      if (hoursBefore >= 24) refund = booking.creditsUsed;
      else if (hoursBefore >= 12) refund = Math.floor(booking.creditsUsed / 2);
      else refund = 0;
      await this.bookingsService.update(id, {
        status: BookingStatus.CANCELLED,
      });
      if (refund > 0) {
        await this.bookingAggregator.refundCredits({
          userId,
          amount: refund,
          description: `Refund for cancelled booking ${booking.id}`,
          referenceId: booking.id,
        });
      }
      return { bookingId: booking.id, status: BookingStatus.CANCELLED, refund };
    } catch (error) {
      console.error('Cancel booking error:', error);
      return {
        status: error.statusCode || 400,
        code: error.code || 'CANCEL_BOOKING_ERROR',
        message:
          error.message || 'An error occurred during booking cancellation',
      };
    }
  }
}
