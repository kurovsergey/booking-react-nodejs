import { Repository } from 'typeorm';
import { WorkingSeat } from './entities/working-seat.entity';
import { CreateWorkingSeatDto, UpdateWorkingSeatDto } from './dto/seats.dto';
export declare class WorkingSeatsService {
    private readonly seatRepository;
    constructor(seatRepository: Repository<WorkingSeat>);
    create(dto: CreateWorkingSeatDto, createdById: string): Promise<WorkingSeat>;
    findAll(): Promise<WorkingSeat[]>;
    findOne(id: string): Promise<WorkingSeat>;
    update(id: string, dto: UpdateWorkingSeatDto): Promise<WorkingSeat>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
