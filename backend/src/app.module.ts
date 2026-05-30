import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './config/typeorm.config';
import { SeederService } from './database/seeds/seeder.service';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OfficesModule } from './modules/offices/offices.module';
import { WorkingSeatsModule } from './modules/seats/seats.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
      migrationsRun: true, // Auto run migrations on startup
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    OfficesModule,
    WorkingSeatsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule { }
