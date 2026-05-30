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
exports.WorkingSeat = void 0;
const typeorm_1 = require("typeorm");
const office_entity_1 = require("../../offices/entities/office.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let WorkingSeat = class WorkingSeat {
    id;
    name;
    description;
    price;
    availability;
    officeId;
    createdById;
    createdAt;
    updatedAt;
    office;
    createdBy;
    bookings;
};
exports.WorkingSeat = WorkingSeat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkingSeat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WorkingSeat.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkingSeat.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], WorkingSeat.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], WorkingSeat.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'office_id' }),
    __metadata("design:type", String)
], WorkingSeat.prototype, "officeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], WorkingSeat.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorkingSeat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorkingSeat.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => office_entity_1.Office, (office) => office.seats, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'office_id' }),
    __metadata("design:type", office_entity_1.Office)
], WorkingSeat.prototype, "office", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdSeats, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], WorkingSeat.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.workingSeat),
    __metadata("design:type", Array)
], WorkingSeat.prototype, "bookings", void 0);
exports.WorkingSeat = WorkingSeat = __decorate([
    (0, typeorm_1.Entity)('working_seats')
], WorkingSeat);
//# sourceMappingURL=working-seat.entity.js.map