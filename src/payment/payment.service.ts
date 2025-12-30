import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus, PaymentTargetType } from './payment.enums';

import { toPaymentResponse } from './payment.mapper';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ListPaymentsQueryDto } from './dto/list-payments.query.dto';
import { PaginatedDto } from './common/paginated.dto';

type CurrentUserLike = { sub?: string; id?: string; role?: string };

function getUserId(u: CurrentUserLike): string {
  return String(u?.sub || u?.id || '');
}
function isAdmin(u: CurrentUserLike): boolean {
  return String(u?.role || '').toUpperCase() === 'ADMIN';
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  // CREATE
  async create(
    dto: CreatePaymentDto,
    user: CurrentUserLike,
  ): Promise<PaymentResponseDto> {
    const ownerId = getUserId(user);

    const payment = this.repo.create({
      ownerId,
      amount: dto.amount,
      currency: dto.currency ?? 'TRY',
      method: dto.method,
      status: dto.status ?? PaymentStatus.PENDING,
      description: dto.description ?? null,
      targetType: dto.targetType ?? PaymentTargetType.OTHER,
      targetId: dto.targetId ?? null,
    });

    const saved = await this.repo.save(payment);
    return toPaymentResponse(saved);
  }

  // LIST (pagination + filters)
  async list(
    q: ListPaymentsQueryDto,
    user: CurrentUserLike,
  ): Promise<PaginatedDto<PaymentResponseDto>> {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('p');

    // ownership
    if (!isAdmin(user)) {
      qb.andWhere('p.ownerId = :ownerId', { ownerId: getUserId(user) });
    }

    // filters
    if (q.status) qb.andWhere('p.status = :status', { status: q.status });
    if (q.method) qb.andWhere('p.method = :method', { method: q.method });

    // date range filter (createdAt)
    if (q.from || q.to) {
      const from = q.from
        ? new Date(q.from)
        : new Date('1970-01-01T00:00:00.000Z');
      const to = q.to ? new Date(q.to) : new Date();
      qb.andWhere('p.createdAt BETWEEN :from AND :to', { from, to });
    }

    qb.orderBy('p.createdAt', 'DESC').skip(skip).take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map(toPaymentResponse),
      page,
      limit,
      total,
    };
  }

  // GET ONE
  async findOne(
    id: string,
    user: CurrentUserLike,
  ): Promise<PaymentResponseDto> {
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (!isAdmin(user) && payment.ownerId !== getUserId(user)) {
      throw new ForbiddenException('Not allowed');
    }

    return toPaymentResponse(payment);
  }

  // UPDATE
  async update(
    id: string,
    dto: UpdatePaymentDto,
    user: CurrentUserLike,
  ): Promise<PaymentResponseDto> {
    // Authorization check included
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Payment not found');

    if (!isAdmin(user) && existing.ownerId !== getUserId(user)) {
      throw new ForbiddenException('Not allowed');
    }

    // Merge (undefined alanlar dokunmaz)
    Object.assign(existing, dto);

    // explicit null-handling if you want to allow clearing:
    // if (dto.description === undefined) existing.description = existing.description;

    const saved = await this.repo.save(existing);
    return toPaymentResponse(saved);
  }

  // DELETE
  async remove(id: string, user: CurrentUserLike): Promise<{ ok: true }> {
    // Authorization check included
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (!isAdmin(user) && payment.ownerId !== getUserId(user)) {
      throw new ForbiddenException('Not allowed');
    }

    await this.repo.remove(payment);
    return { ok: true };
  }
}
