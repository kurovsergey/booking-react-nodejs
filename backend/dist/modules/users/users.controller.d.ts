import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken?: string | null;
        resetPasswordToken?: string | null;
        bookings?: import("../bookings/entities/booking.entity").Booking[];
        createdOffices?: import("../offices/entities/office.entity").Office[];
        createdSeats?: import("../seats/entities/working-seat.entity").WorkingSeat[];
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken?: string | null;
        resetPasswordToken?: string | null;
        bookings?: import("../bookings/entities/booking.entity").Booking[];
        createdOffices?: import("../offices/entities/office.entity").Office[];
        createdSeats?: import("../seats/entities/working-seat.entity").WorkingSeat[];
    }[]>;
    findOne(id: string, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken?: string | null;
        resetPasswordToken?: string | null;
        bookings?: import("../bookings/entities/booking.entity").Booking[];
        createdOffices?: import("../offices/entities/office.entity").Office[];
        createdSeats?: import("../seats/entities/working-seat.entity").WorkingSeat[];
    }>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken?: string | null;
        resetPasswordToken?: string | null;
        bookings?: import("../bookings/entities/booking.entity").Booking[];
        createdOffices?: import("../offices/entities/office.entity").Office[];
        createdSeats?: import("../seats/entities/working-seat.entity").WorkingSeat[];
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
