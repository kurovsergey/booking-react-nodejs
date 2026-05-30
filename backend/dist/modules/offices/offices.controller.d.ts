import { OfficesService } from './offices.service';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/offices.dto';
export declare class OfficesController {
    private readonly officesService;
    constructor(officesService: OfficesService);
    create(dto: CreateOfficeDto, req: any): Promise<import("./entities/office.entity").Office>;
    findAll(): Promise<import("./entities/office.entity").Office[]>;
    findOne(id: string, req: any): Promise<import("./entities/office.entity").Office>;
    update(id: string, dto: UpdateOfficeDto, req: any): Promise<import("./entities/office.entity").Office>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
