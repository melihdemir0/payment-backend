import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentTargetType,
} from './payment.enums';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  ownerId!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: string; // numeric => string daha güvenli

  @Column({ type: 'varchar', length: 3, default: 'TRY' })
  currency!: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method!: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description?: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: PaymentTargetType,
    default: PaymentTargetType.OTHER,
  })
  targetType!: PaymentTargetType;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true })
  targetId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
