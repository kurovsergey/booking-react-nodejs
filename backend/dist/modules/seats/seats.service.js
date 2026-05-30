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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingSeatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const working_seat_entity_1 = require("./entities/working-seat.entity");
let WorkingSeatsService = class WorkingSeatsService {
    seatRepository;
    constructor(seatRepository) {
        this.seatRepository = seatRepository;
    }
    async create(dto, createdById) {
        const seat = this.seatRepository.create({
            ...dto,
            createdById,
        });
        return this.seatRepository.save(seat);
    }
    async findAll() {
        return this.seatRepository.find({ relations: { office: true } });
    }
    async findOne(id) {
        const seat = await this.seatRepository.findOne({ where: { id }, relations: { office: true } });
        if (!seat) {
            throw new common_1.NotFoundException('Working seat not found');
        }
        return seat;
    }
    async update(id, dto) {
        const seat = await this.findOne(id);
        Object.assign(seat, dto);
        return this.seatRepository.save(seat);
    }
    async remove(id) {
        const seat = await this.findOne(id);
        await this.seatRepository.remove(seat);
        return { message: 'Working seat deleted successfully' };
    }
};
exports.WorkingSeatsService = WorkingSeatsService;
exports.WorkingSeatsService = WorkingSeatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(working_seat_entity_1.WorkingSeat)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkingSeatsService);
//# sourceMappingURL=seats.service.js.map