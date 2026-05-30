import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    findAll(req: any): Promise<import("./entities/booking.entity").Booking[]>;
    findOne(id: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    update(id: string, dto: UpdateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
