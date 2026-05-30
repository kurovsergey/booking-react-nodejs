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
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const office_entity_1 = require("../../offices/entities/office.entity");
const working_seat_entity_1 = require("../../seats/entities/working-seat.entity");
let Booking = class Booking {
    id;
    userId;
    officeId;
    workingSeatId;
    startDate;
    endDate;
    status;
    user;
    office;
    workingSeat;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'office_id' }),
    __metadata("design:type", String)
], Booking.prototype, "officeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'working_seat_id' }),
    __metadata("design:type", String)
], Booking.prototype, "workingSeatId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'date', name: 'start_date' }),
    __metadata("design:type", Date)
], Booking.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'date', name: 'end_date' }),
    __metadata("design:type", Date)
], Booking.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'confirmed' }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => office_entity_1.Office, (office) => office.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'office_id' }),
    __metadata("design:type", office_entity_1.Office)
], Booking.prototype, "office", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => working_seat_entity_1.WorkingSeat, (seat) => seat.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'working_seat_id' }),
    __metadata("design:type", working_seat_entity_1.WorkingSeat)
], Booking.prototype, "workingSeat", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings'),
    (0, typeorm_1.Index)(['workingSeatId', 'startDate', 'endDate'])
], Booking);
//# sourceMappingURL=booking.entity.js.map