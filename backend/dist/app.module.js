"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_config_1 = require("./config/typeorm.config");
const seeder_service_1 = require("./database/seeds/seeder.service");
const redis_module_1 = require("./modules/redis/redis.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const offices_module_1 = require("./modules/offices/offices.module");
const seats_module_1 = require("./modules/seats/seats.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                ...typeorm_config_1.AppDataSource.options,
                autoLoadEntities: true,
                migrationsRun: true,
            }),
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            offices_module_1.OfficesModule,
            seats_module_1.WorkingSeatsModule,
            bookings_module_1.BookingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, seeder_service_1.SeederService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map