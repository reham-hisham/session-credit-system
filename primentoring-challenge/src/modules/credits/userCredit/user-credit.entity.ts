import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['userId'])
export class UserCredit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  @Index()
  userId: string;

  @Column('int', { default: 0 })
  creditBalance: number;

  @Column('int', { default: 0 })
  totalPurchased: number;

  @Column('int', { default: 0 })
  totalUsed: number;
}
