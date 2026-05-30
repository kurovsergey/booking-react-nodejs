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
exports.WorkingSeatsController = void 0;
const common_1 = require("@nestjs/common");
const seats_service_1 = require("./seats.service");
const seats_dto_1 = require("./dto/seats.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let WorkingSeatsController = class WorkingSeatsController {
    seatsService;
    constructor(seatsService) {
        this.seatsService = seatsService;
    }
    create(dto, req) {
        return this.seatsService.create(dto, req.user.id);
    }
    findAll() {
        return this.seatsService.findAll();
    }
    async findOne(id, req) {
        const seat = await this.seatsService.findOne(id);
        if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
            throw new common_1.ForbiddenException('You do not own this working seat');
        }
        return seat;
    }
    async update(id, dto, req) {
        const seat = await this.seatsService.findOne(id);
        if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
            throw new common_1.ForbiddenException('You can only update your own working seat');
        }
        return this.seatsService.update(id, dto);
    }
    async remove(id, req) {
        const seat = await this.seatsService.findOne(id);
        if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
            throw new common_1.ForbiddenException('You can only delete your own working seat');
        }
        return this.seatsService.remove(id);
    }
};
exports.WorkingSeatsController = WorkingSeatsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seats_dto_1.CreateWorkingSeatDto, Object]),
    __metadata("design:returntype", void 0)
], WorkingSeatsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkingSeatsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkingSeatsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, seats_dto_1.UpdateWorkingSeatDto, Object]),
    __metadata("design:returntype", Promise)
], WorkingSeatsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkingSeatsController.prototype, "remove", null);
exports.WorkingSeatsController = WorkingSeatsController = __decorate([
    (0, common_1.Controller)('seats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [seats_service_1.WorkingSeatsService])
], WorkingSeatsController);
//# sourceMappingURL=seats.controller.js.map