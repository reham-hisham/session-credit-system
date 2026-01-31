import { ApiProperty } from '@nestjs/swagger';

export class UserCreditDto {

  @ApiProperty()
  userId: string;

  @ApiProperty()
  creditBalance: number;

  @ApiProperty()
  totalPurchased: number;

  @ApiProperty()
  totalUsed: number;
}
