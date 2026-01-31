import {
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isDurationMultiple', async: false })
export class IsDurationMultiple implements ValidatorConstraintInterface {
  validate(duration: number) {
    const baseDuration = parseInt(
      process.env.BASE_BOOKING_DURATION || '30',
      10,
    );
    const maxDuration = parseInt(
      process.env.MAX_BOOKING_DURATION_MINUTES || '180',
      10,
    );

    if (duration < baseDuration) return false;
    if (duration > maxDuration) return false;
    if (duration % baseDuration !== 0) return false;

    return true;
  }

  defaultMessage() {
    const baseDuration = parseInt(
      process.env.BASE_BOOKING_DURATION || '30',
      10,
    );
    const maxDuration = parseInt(
      process.env.MAX_BOOKING_DURATION_MINUTES || '180',
      10,
    );
    return `Duration must be a multiple of ${baseDuration} minutes and not exceed ${maxDuration} minutes (e.g., ${baseDuration}, ${baseDuration * 2}, ${baseDuration * 3}, etc.)`;
  }
}

export class CreateBookingDto {
  @ApiProperty({ example: 'eeec42a8-a876-4ddb-ac53-5c25f38ff08f' })
  @IsUUID()
  mentorId: string;

  @ApiProperty({ example: '2026-06-01T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({
    example: 60,
    description: 'Duration in minutes (must be multiple of 30)',
  })
  @IsInt()
  @Min(30)
  @Validate(IsDurationMultiple)
  duration: number;
}
