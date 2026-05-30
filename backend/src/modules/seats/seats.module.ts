import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingSeatsService } from './seats.service';
import { WorkingSeatsController } from './seats.controller';
import { WorkingSeat } from './entities/working-seat.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingSeat]), AuthModule],
  controllers: [WorkingSeatsController],
  providers: [WorkingSeatsService],
  exports: [WorkingSeatsService],
})
export class WorkingSeatsModule {}
