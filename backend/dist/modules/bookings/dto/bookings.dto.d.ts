export declare class CreateBookingDto {
    workingSeatId: string;
    officeId: string;
    startDate: string;
    endDate: string;
}
export declare class UpdateBookingDto {
    startDate?: string;
    endDate?: string;
    status?: string;
}
