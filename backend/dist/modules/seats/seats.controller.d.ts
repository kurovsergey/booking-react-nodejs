import { WorkingSeatsService } from './seats.service';
import { CreateWorkingSeatDto, UpdateWorkingSeatDto } from './dto/seats.dto';
export declare class WorkingSeatsController {
    private readonly seatsService;
    constructor(seatsService: WorkingSeatsService);
    create(dto: CreateWorkingSeatDto, req: any): Promise<import("./entities/working-seat.entity").WorkingSeat>;
    findAll(): Promise<import("./entities/working-seat.entity").WorkingSeat[]>;
    findOne(id: string, req: any): Promise<import("./entities/working-seat.entity").WorkingSeat>;
    update(id: string, dto: UpdateWorkingSeatDto, req: any): Promise<import("./entities/working-seat.entity").WorkingSeat>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
