import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/offices.dto';
export declare class OfficesService {
    private readonly officeRepository;
    constructor(officeRepository: Repository<Office>);
    create(dto: CreateOfficeDto, createdById: string): Promise<Office>;
    findAll(): Promise<Office[]>;
    findOne(id: string): Promise<Office>;
    update(id: string, dto: UpdateOfficeDto): Promise<Office>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
