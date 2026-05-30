import { User } from '../../users/entities/user.entity';
import { Office } from '../../offices/entities/office.entity';
import { WorkingSeat } from '../../seats/entities/working-seat.entity';
export declare class Booking {
    id: string;
    userId: string;
    officeId: string;
    workingSeatId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    user: User;
    office: Office;
    workingSeat: WorkingSeat;
}
