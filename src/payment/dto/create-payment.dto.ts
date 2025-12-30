import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
} from '../payment.enums';

export class CreatePaymentDto {
  @IsNumberString()
  amount!: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string; // default TRY

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus; // default PENDING

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsEnum(PaymentTargetType)
  targetType?: PaymentTargetType; // default OTHER

  @IsOptional()
  @IsString()
  @MaxLength(64)
  targetId?: string;
}
