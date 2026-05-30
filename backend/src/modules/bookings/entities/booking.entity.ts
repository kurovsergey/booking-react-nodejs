import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Office } from '../../offices/entities/office.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';

@Entity('bookings')
@Index(['workingSeatId', 'startDate', 'endDate']) // Composite index for optimization
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'office_id' })
  officeId!: string;

  @Column({ name: 'working_seat_id' })
  workingSeatId!: string;

  @Index()
  @Column({ type: 'date', name: 'start_date' })
  startDate!: Date;

  @Index()
  @Column({ type: 'date', name: 'end_date' })
  endDate!: Date;

  @Column({ type: 'varchar', length: 50, default: 'confirmed' })
  status!: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Office, (office) => office.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'office_id' })
  office!: Office;

  @ManyToOne(() => WorkingSeat, (seat) => seat.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'working_seat_id' })
  workingSeat!: WorkingSeat;
}
