import { Booking } from '../../bookings/entities/booking.entity';
import { Office } from '../../offices/entities/office.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    verificationToken?: string | null;
    resetPasswordToken?: string | null;
    bookings?: Booking[];
    createdOffices?: Office[];
    createdSeats?: WorkingSeat[];
}
