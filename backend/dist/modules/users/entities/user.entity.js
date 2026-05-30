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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const office_entity_1 = require("../../offices/entities/office.entity");
const working_seat_entity_1 = require("../../seats/entities/working-seat.entity");
let User = class User {
    id;
    name;
    email;
    password;
    role;
    isVerified;
    verificationToken;
    resetPasswordToken;
    bookings;
    createdOffices;
    createdSeats;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_verified', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'verification_token', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "verificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reset_password_token', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.user),
    __metadata("design:type", Array)
], User.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => office_entity_1.Office, (office) => office.createdBy),
    __metadata("design:type", Array)
], User.prototype, "createdOffices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => working_seat_entity_1.WorkingSeat, (seat) => seat.createdBy),
    __metadata("design:type", Array)
], User.prototype, "createdSeats", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map