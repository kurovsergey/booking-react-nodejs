import { Office } from '../../offices/entities/office.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';
export declare class WorkingSeat {
    id: string;
    name: string;
    description?: string;
    price: number;
    availability: boolean;
    officeId: string;
    createdById?: string | null;
    createdAt: Date;
    updatedAt: Date;
    office: Office;
    createdBy?: User;
    bookings?: Booking[];
}
