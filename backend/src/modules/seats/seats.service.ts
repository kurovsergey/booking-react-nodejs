import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingSeat } from './entities/working-seat.entity';
import { CreateWorkingSeatDto, UpdateWorkingSeatDto } from './dto/seats.dto';

@Injectable()
export class WorkingSeatsService {
  constructor(
    @InjectRepository(WorkingSeat)
    private readonly seatRepository: Repository<WorkingSeat>,
  ) {}

  async create(dto: CreateWorkingSeatDto, createdById: string) {
    const seat = this.seatRepository.create({
      ...dto,
      createdById,
    });
    return this.seatRepository.save(seat);
  }

  async findAll() {
    return this.seatRepository.find({ relations: { office: true } });
  }

  async findOne(id: string) {
    const seat = await this.seatRepository.findOne({ where: { id }, relations: { office: true } });
    if (!seat) {
      throw new NotFoundException('Working seat not found');
    }
    return seat;
  }

  async update(id: string, dto: UpdateWorkingSeatDto) {
    const seat = await this.findOne(id);
    Object.assign(seat, dto);
    return this.seatRepository.save(seat);
  }

  async remove(id: string) {
    const seat = await this.findOne(id);
    await this.seatRepository.remove(seat);
    return { message: 'Working seat deleted successfully' };
  }
}
