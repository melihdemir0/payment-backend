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

type CurrentUserLike = { sub?: string; id?: string; role?: string };

function getUserId(u: CurrentUserLike): string {
  return (u?.sub || u?.id || '') as string;
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

  async create(dto: CreatePaymentDto, user: CurrentUserLike) {
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
    return this.repo.save(payment);
  }

  async findAll(user: CurrentUserLike) {
    if (isAdmin(user)) return this.repo.find({ order: { createdAt: 'DESC' } });

    const ownerId = getUserId(user);
    return this.repo.find({ where: { ownerId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user: CurrentUserLike) {
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (!isAdmin(user) && payment.ownerId !== getUserId(user)) {
      throw new ForbiddenException('Not allowed');
    }
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto, user: CurrentUserLike) {
    const payment = await this.findOne(id, user);
    Object.assign(payment, {
      ...dto,
      currency: dto.currency ?? payment.currency,
      description: dto.description ?? payment.description,
      targetId: dto.targetId ?? payment.targetId,
      targetType: dto.targetType ?? payment.targetType,
      status: dto.status ?? payment.status,
    });
    return this.repo.save(payment);
  }

  async remove(id: string, user: CurrentUserLike) {
    const payment = await this.findOne(id, user);
    await this.repo.remove(payment);
    return { ok: true };
  }
}
