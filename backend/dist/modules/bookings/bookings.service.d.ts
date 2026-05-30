import { DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
export declare class BookingsService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    create(dto: CreateBookingDto, userId: string): Promise<Booking>;
    findAll(userId?: string): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    update(id: string, dto: UpdateBookingDto, userId?: string): Promise<Booking>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
