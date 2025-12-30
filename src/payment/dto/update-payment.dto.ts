<<<<<<< HEAD
import { PartialType } from '@nestjs/swagger';
=======
import { PartialType } from '@nestjs/mapped-types';
>>>>>>> origin/develop
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
