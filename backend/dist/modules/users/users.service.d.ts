import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateUserDto): Promise<{
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
