import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
} from '../payment.enums';

export class CreatePaymentDto {
  @ApiProperty({
    example: '199.90',
    description: 'Payment amount (numeric string)',
  })
  @IsNumberString()
  amount!: string;

  @ApiPropertyOptional({
    example: 'TRY',
    description: 'Currency code (ISO 4217)',
    minLength: 3,
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string; // default TRY

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
    description: 'Payment method',
  })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
    description: 'Payment status',
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus; // default PENDING

  @ApiPropertyOptional({
    example: 'Invoice payment',
    description: 'Optional payment description',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    enum: PaymentTargetType,
    example: PaymentTargetType.INVOICE,
    description: 'Related entity type',
  })
  @IsOptional()
  @IsEnum(PaymentTargetType)
  targetType?: PaymentTargetType; // default OTHER

  @ApiPropertyOptional({
    example: 'INV-1001',
    description: 'Related entity ID',
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  targetId?: string;
}
