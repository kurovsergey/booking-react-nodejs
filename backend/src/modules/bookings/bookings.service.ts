import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateBookingDto, userId: string) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate > endDate) {
      throw new ConflictException('Start date must be before or equal to end date.');
    }

    return this.dataSource.transaction(async (manager) => {
      const overlapping = await manager
        .getRepository(Booking)
        .createQueryBuilder('booking')
        .setLock('pessimistic_write')
        .where('booking.working_seat_id = :seatId', { seatId: dto.workingSeatId })
        .andWhere('booking.status = :status', { status: 'confirmed' })
        .andWhere(
          '(booking.start_date <= :endDate AND booking.end_date >= :startDate)',
          { startDate, endDate }
        )
        .getMany();

      if (overlapping.length > 0) {
        throw new ConflictException('This seat is already booked for the selected dates.');
      }

      const booking = manager.getRepository(Booking).create({
        userId,
        officeId: dto.officeId,
        workingSeatId: dto.workingSeatId,
        startDate,
        endDate,
        status: 'confirmed',
      });

      return manager.getRepository(Booking).save(booking);
    });
  }

  async findAll(userId?: string) {
    const query = this.dataSource.getRepository(Booking)
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.office', 'office')
      .leftJoinAndSelect('booking.workingSeat', 'workingSeat');

    if (userId) {
      query.where('booking.user_id = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const booking = await this.dataSource.getRepository(Booking).findOne({
      where: { id },
      relations: { user: true, office: true, workingSeat: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto, userId?: string) {
    return this.dataSource.transaction(async (manager) => {
      const booking = await manager.getRepository(Booking).findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      const newStartDate = dto.startDate ? new Date(dto.startDate) : booking.startDate;
      const newEndDate = dto.endDate ? new Date(dto.endDate) : booking.endDate;

      if (newStartDate > newEndDate) {
        throw new ConflictException('Start date must be before or equal to end date.');
      }

      if (dto.startDate || dto.endDate || (dto.status === 'confirmed' && booking.status !== 'confirmed')) {
        const overlapping = await manager
          .getRepository(Booking)
          .createQueryBuilder('booking')
          .setLock('pessimistic_write')
          .where('booking.working_seat_id = :seatId', { seatId: booking.workingSeatId })
          .andWhere('booking.id != :id', { id })
          .andWhere('booking.status = :status', { status: 'confirmed' })
          .andWhere(
            '(booking.start_date <= :endDate AND booking.end_date >= :startDate)',
            { startDate: newStartDate, endDate: newEndDate }
          )
          .getMany();

        if (overlapping.length > 0) {
          throw new ConflictException('This seat is already booked for the selected dates.');
        }
      }

      if (dto.startDate) booking.startDate = newStartDate;
      if (dto.endDate) booking.endDate = newEndDate;
      if (dto.status) booking.status = dto.status;

      return manager.getRepository(Booking).save(booking);
    });
  }

  async remove(id: string) {
    const bookingRepository = this.dataSource.getRepository(Booking);
    const booking = await this.findOne(id);
    await bookingRepository.remove(booking);
    return { message: 'Booking deleted successfully' };
  }
}
