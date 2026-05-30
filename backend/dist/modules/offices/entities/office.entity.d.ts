import { Booking } from '../../bookings/entities/booking.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';
import { User } from '../../users/entities/user.entity';
export declare class Office {
    id: string;
    name: string;
    description?: string;
    price: number;
    availability: boolean;
    createdById?: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: User;
    seats?: WorkingSeat[];
    bookings?: Booking[];
}
