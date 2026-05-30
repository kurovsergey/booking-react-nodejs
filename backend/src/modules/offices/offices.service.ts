import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/offices.dto';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
  ) {}

  async create(dto: CreateOfficeDto, createdById: string) {
    const office = this.officeRepository.create({
      ...dto,
      createdById,
    });
    return this.officeRepository.save(office);
  }

  async findAll() {
    return this.officeRepository.find();
  }

  async findOne(id: string) {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException('Office not found');
    }
    return office;
  }

  async update(id: string, dto: UpdateOfficeDto) {
    const office = await this.findOne(id);
    Object.assign(office, dto);
    return this.officeRepository.save(office);
  }

  async remove(id: string) {
    const office = await this.findOne(id);
    await this.officeRepository.remove(office);
    return { message: 'Office deleted successfully' };
  }
}
