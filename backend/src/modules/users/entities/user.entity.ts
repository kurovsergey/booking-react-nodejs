import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Office } from '../../offices/entities/office.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role!: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ name: 'verification_token', type: 'varchar', length: 255, nullable: true })
  verificationToken?: string | null;

  @Column({ name: 'reset_password_token', type: 'varchar', length: 255, nullable: true })
  resetPasswordToken?: string | null;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings?: Booking[];

  @OneToMany(() => Office, (office) => office.createdBy)
  createdOffices?: Office[];

  @OneToMany(() => WorkingSeat, (seat) => seat.createdBy)
  createdSeats?: WorkingSeat[];
}
