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
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/users/entities/user.entity");
const office_entity_1 = require("../../modules/offices/entities/office.entity");
const working_seat_entity_1 = require("../../modules/seats/entities/working-seat.entity");
const booking_entity_1 = require("../../modules/bookings/entities/booking.entity");
let SeederService = SeederService_1 = class SeederService {
    dataSource;
    logger = new common_1.Logger(SeederService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        if (process.env.RUN_SEEDS === 'true') {
            this.logger.log('Starting database seeding...');
            await this.seed();
        }
    }
    async seed() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const userCount = await queryRunner.manager.count(user_entity_1.User);
        if (userCount > 0) {
            this.logger.log('Database already has data. Skipping seed.');
            await queryRunner.release();
            return;
        }
        await queryRunner.startTransaction();
        try {
            this.logger.log('Seeding users...');
            const users = queryRunner.manager.create(user_entity_1.User, [
                {
                    name: 'Admin',
                    email: 'admin@coworking.com',
                    password: 'adminpassword',
                    role: 'admin',
                },
                {
                    name: 'Ivan Ivanov',
                    email: 'ivan@gmail.com',
                    password: 'userpassword1',
                    role: 'user',
                },
                {
                    name: 'Petr Petrov',
                    email: 'petr@gmail.com',
                    password: 'userpassword2',
                    role: 'user',
                },
            ]);
            const savedUsers = await queryRunner.manager.save(users);
            this.logger.log('Seeding offices...');
            const offices = queryRunner.manager.create(office_entity_1.Office, [
                {
                    name: 'Open Space Zone A',
                    description: 'Vibrant and collaborative open workspace area.',
                    price: 15.00,
                    availability: true,
                },
                {
                    name: 'Quiet Zone B',
                    description: 'A noise-free zone designed for deep focus and productivity.',
                    price: 20.00,
                    availability: true,
                },
                {
                    name: 'Private Office Alpha',
                    description: 'A premium locked private office for team of 4.',
                    price: 120.00,
                    availability: true,
                },
            ]);
            const savedOffices = await queryRunner.manager.save(offices);
            this.logger.log('Seeding working seats...');
            const seats = [];
            for (let i = 1; i <= 5; i++) {
                seats.push({
                    name: `Seat A-${i}`,
                    description: `Desk space in Open Space Zone A near the window`,
                    price: 15.00,
                    availability: true,
                    officeId: savedOffices[0].id,
                });
            }
            for (let i = 1; i <= 3; i++) {
                seats.push({
                    name: `Seat B-${i}`,
                    description: `Ergonomic desk in Quiet Zone B with noise isolation`,
                    price: 20.00,
                    availability: true,
                    officeId: savedOffices[1].id,
                });
            }
            seats.push({
                name: `Office Room A-1`,
                description: `Full access to Private Office Alpha`,
                price: 120.00,
                availability: true,
                officeId: savedOffices[2].id,
            });
            const seatEntities = queryRunner.manager.create(working_seat_entity_1.WorkingSeat, seats);
            const savedSeats = await queryRunner.manager.save(seatEntities);
            this.logger.log('Seeding bookings...');
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const bookings = queryRunner.manager.create(booking_entity_1.Booking, [
                {
                    userId: savedUsers[1].id,
                    officeId: savedOffices[0].id,
                    workingSeatId: savedSeats[0].id,
                    startDate: today,
                    endDate: tomorrow,
                    status: 'confirmed',
                },
                {
                    userId: savedUsers[2].id,
                    officeId: savedOffices[1].id,
                    workingSeatId: savedSeats[5].id,
                    startDate: today,
                    endDate: tomorrow,
                    status: 'confirmed',
                },
            ]);
            await queryRunner.manager.save(bookings);
            await queryRunner.commitTransaction();
            this.logger.log('Database seeded successfully!');
        }
        catch (err) {
            this.logger.error('Failed to seed database, rolling back transaction', err);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SeederService);
//# sourceMappingURL=seeder.service.js.map