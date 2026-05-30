"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingSeatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seats_service_1 = require("./seats.service");
const seats_controller_1 = require("./seats.controller");
const working_seat_entity_1 = require("./entities/working-seat.entity");
const auth_module_1 = require("../auth/auth.module");
let WorkingSeatsModule = class WorkingSeatsModule {
};
exports.WorkingSeatsModule = WorkingSeatsModule;
exports.WorkingSeatsModule = WorkingSeatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([working_seat_entity_1.WorkingSeat]), auth_module_1.AuthModule],
        controllers: [seats_controller_1.WorkingSeatsController],
        providers: [seats_service_1.WorkingSeatsService],
        exports: [seats_service_1.WorkingSeatsService],
    })
], WorkingSeatsModule);
//# sourceMappingURL=seats.module.js.map