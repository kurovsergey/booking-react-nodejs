import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';
import { User } from '../../users/entities/user.entity';

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'boolean', default: true })
  availability!: boolean;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.createdOffices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @OneToMany(() => WorkingSeat, (seat) => seat.office)
  seats?: WorkingSeat[];

  @OneToMany(() => Booking, (booking) => booking.office)
  bookings?: Booking[];
}
