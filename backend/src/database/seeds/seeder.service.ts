import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Office } from '../../modules/offices/entities/office.entity';
import { WorkingSeat } from '../../modules/seats/entities/working-seat.entity';
import { Booking } from '../../modules/bookings/entities/booking.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly dataSource: DataSource) { }

  async onApplicationBootstrap() {
    if (process.env.RUN_SEEDS === 'true') {
      this.logger.log('Starting database seeding...');
      await this.seed();
    }
  }

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Check if data already exists
    const userCount = await queryRunner.manager.count(User);
    if (userCount > 0) {
      this.logger.log('Database already has data. Skipping seed.');
      await queryRunner.release();
      return;
    }

    await queryRunner.startTransaction();
    try {
      this.logger.log('Seeding users...');
      const users = queryRunner.manager.create(User, [
        {
          name: 'Admin',
          email: 'admin@coworking.com',
          password: 'adminpassword', // Plain text for seeding convenience in test tasks
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
      const offices = queryRunner.manager.create(Office, [
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
      const seats: Partial<WorkingSeat>[] = [];

      // 5 seats for Open Space Zone A
      for (let i = 1; i <= 5; i++) {
        seats.push({
          name: `Seat A-${i}`,
          description: `Desk space in Open Space Zone A near the window`,
          price: 15.00,
          availability: true,
          officeId: savedOffices[0].id,
        });
      }

      // 3 seats for Quiet Zone B
      for (let i = 1; i <= 3; i++) {
        seats.push({
          name: `Seat B-${i}`,
          description: `Ergonomic desk in Quiet Zone B with noise isolation`,
          price: 20.00,
          availability: true,
          officeId: savedOffices[1].id,
        });
      }

      // 1 seat for Private Office Alpha
      seats.push({
        name: `Office Room A-1`,
        description: `Full access to Private Office Alpha`,
        price: 120.00,
        availability: true,
        officeId: savedOffices[2].id,
      });

      const seatEntities = queryRunner.manager.create(WorkingSeat, seats);
      const savedSeats = await queryRunner.manager.save(seatEntities);

      this.logger.log('Seeding bookings...');
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const bookings = queryRunner.manager.create(Booking, [
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
    } catch (err) {
      this.logger.error('Failed to seed database, rolling back transaction', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
