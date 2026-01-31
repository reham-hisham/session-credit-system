import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CreditPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  credits: number;

  @Column('int')
  price: number; 

  @Column({ default: true })
  isActive: boolean;
}
