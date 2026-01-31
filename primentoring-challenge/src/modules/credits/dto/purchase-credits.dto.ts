import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PurchaseCreditsDto {
  @ApiProperty({ example: 'package-uuid' })
  @IsUUID()
  packageId: string;
}
