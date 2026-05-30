"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
let BookingsService = class BookingsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async create(dto, userId) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (startDate > endDate) {
            throw new common_1.ConflictException('Start date must be before or equal to end date.');
        }
        return this.dataSource.transaction(async (manager) => {
            const overlapping = await manager
                .getRepository(booking_entity_1.Booking)
                .createQueryBuilder('booking')
                .setLock('pessimistic_write')
                .where('booking.working_seat_id = :seatId', { seatId: dto.workingSeatId })
                .andWhere('booking.status = :status', { status: 'confirmed' })
                .andWhere('(booking.start_date <= :endDate AND booking.end_date >= :startDate)', { startDate, endDate })
                .getMany();
            if (overlapping.length > 0) {
                throw new common_1.ConflictException('This seat is already booked for the selected dates.');
            }
            const booking = manager.getRepository(booking_entity_1.Booking).create({
                userId,
                officeId: dto.officeId,
                workingSeatId: dto.workingSeatId,
                startDate,
                endDate,
                status: 'confirmed',
            });
            return manager.getRepository(booking_entity_1.Booking).save(booking);
        });
    }
    async findAll(userId) {
        const query = this.dataSource.getRepository(booking_entity_1.Booking)
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .leftJoinAndSelect('booking.office', 'office')
            .leftJoinAndSelect('booking.workingSeat', 'workingSeat');
        if (userId) {
            query.where('booking.user_id = :userId', { userId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const booking = await this.dataSource.getRepository(booking_entity_1.Booking).findOne({
            where: { id },
            relations: { user: true, office: true, workingSeat: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async update(id, dto, userId) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.getRepository(booking_entity_1.Booking).findOne({ where: { id } });
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            const newStartDate = dto.startDate ? new Date(dto.startDate) : booking.startDate;
            const newEndDate = dto.endDate ? new Date(dto.endDate) : booking.endDate;
            if (newStartDate > newEndDate) {
                throw new common_1.ConflictException('Start date must be before or equal to end date.');
            }
            if (dto.startDate || dto.endDate || (dto.status === 'confirmed' && booking.status !== 'confirmed')) {
                const overlapping = await manager
                    .getRepository(booking_entity_1.Booking)
                    .createQueryBuilder('booking')
                    .setLock('pessimistic_write')
                    .where('booking.working_seat_id = :seatId', { seatId: booking.workingSeatId })
                    .andWhere('booking.id != :id', { id })
                    .andWhere('booking.status = :status', { status: 'confirmed' })
                    .andWhere('(booking.start_date <= :endDate AND booking.end_date >= :startDate)', { startDate: newStartDate, endDate: newEndDate })
                    .getMany();
                if (overlapping.length > 0) {
                    throw new common_1.ConflictException('This seat is already booked for the selected dates.');
                }
            }
            if (dto.startDate)
                booking.startDate = newStartDate;
            if (dto.endDate)
                booking.endDate = newEndDate;
            if (dto.status)
                booking.status = dto.status;
            return manager.getRepository(booking_entity_1.Booking).save(booking);
        });
    }
    async remove(id) {
        const bookingRepository = this.dataSource.getRepository(booking_entity_1.Booking);
        const booking = await this.findOne(id);
        await bookingRepository.remove(booking);
        return { message: 'Booking deleted successfully' };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map