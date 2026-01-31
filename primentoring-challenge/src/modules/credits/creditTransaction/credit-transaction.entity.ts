import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CreditTransactionType {
  PURCHASE = 'PURCHASE',
  BOOKING = 'BOOKING',
  REFUND = 'REFUND',
  EXPIRED = 'EXPIRED',
  BONUS = 'BONUS',
}

@Entity()
export class CreditTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  @Index()
  userId: string;

  @Column('int')
  amount: number;

  @Column({ type: 'enum', enum: CreditTransactionType })
  type: CreditTransactionType;

  @Column({ nullable: true })
  referenceId: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
