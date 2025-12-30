import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
<<<<<<< HEAD
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ListPaymentsQueryDto } from './dto/list-payments.query.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaginatedDto } from './common/paginated.dto';

@ApiTags('Payments')
=======
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

>>>>>>> origin/develop
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
<<<<<<< HEAD
  @ApiOperation({ summary: 'Create a payment record' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
=======
>>>>>>> origin/develop
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
<<<<<<< HEAD
  @ApiOperation({
    summary: 'List payments (pagination + filters: status, method, date)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated payment list',
    type: PaginatedDto,
  })
  findAll(@Query() q: ListPaymentsQueryDto, @Req() req: any) {
    return this.service.list(q, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by id' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
=======
  findAll(@Req() req: any) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
>>>>>>> origin/develop
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
<<<<<<< HEAD
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
=======
>>>>>>> origin/develop
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
<<<<<<< HEAD
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment removed' })
=======
>>>>>>> origin/develop
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user);
  }
}
