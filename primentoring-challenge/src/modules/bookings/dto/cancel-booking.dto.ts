import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({ example: 'booking-uuid' })
  @IsUUID()
  bookingId: string;
}
