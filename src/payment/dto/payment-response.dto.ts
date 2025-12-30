import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
} from '../payment.enums';

export class PaymentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() ownerId!: string;

  @ApiProperty({ example: '199.90' })
  amount!: string;

  @ApiProperty({ example: 'TRY' })
  currency!: string;

  @ApiProperty({ enum: PaymentMethod })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: PaymentTargetType })
  targetType!: PaymentTargetType;

  @ApiProperty({ nullable: true })
  targetId!: string | null;

  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
