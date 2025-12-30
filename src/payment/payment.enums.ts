export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentTargetType {
  ORDER = 'ORDER',
  INVOICE = 'INVOICE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  OTHER = 'OTHER',
}
