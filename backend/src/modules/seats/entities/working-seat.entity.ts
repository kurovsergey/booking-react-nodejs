import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Office } from '../../offices/entities/office.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity('working_seats')
export class WorkingSeat {
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

  @Column({ name: 'office_id' })
  officeId!: string;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Office, (office) => office.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'office_id' })
  office!: Office;

  @ManyToOne(() => User, (user) => user.createdSeats, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: User;

  @OneToMany(() => Booking, (booking) => booking.workingSeat)
  bookings?: Booking[];
}
