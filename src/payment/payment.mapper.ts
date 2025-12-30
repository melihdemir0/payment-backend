import { Payment } from './payment.entity';
import { PaymentResponseDto } from './dto/payment-response.dto';

export function toPaymentResponse(p: Payment): PaymentResponseDto {
  return {
    id: p.id,
    ownerId: p.ownerId,
    amount: p.amount,
    currency: p.currency,
    method: p.method,
    status: p.status,
    description: p.description ?? null,
    targetType: p.targetType,
    targetId: p.targetId ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
