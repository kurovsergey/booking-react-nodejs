import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1717000000000 implements MigrationInterface {
  name = 'InitialSchema1717000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "role" character varying(50) NOT NULL DEFAULT 'user',
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // Create offices table
    await queryRunner.query(`
      CREATE TABLE "offices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "availability" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_offices" PRIMARY KEY ("id")
      )
    `);

    // Create working_seats table
    await queryRunner.query(`
      CREATE TABLE "working_seats" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "price" numeric(10,2) NOT NULL,
        "availability" boolean NOT NULL DEFAULT true,
        "office_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_working_seats" PRIMARY KEY ("id"),
        CONSTRAINT "FK_working_seats_offices" FOREIGN KEY ("office_id") REFERENCES "offices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create bookings table
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "office_id" uuid NOT NULL,
        "working_seat_id" uuid NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" character varying(50) NOT NULL DEFAULT 'confirmed',
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bookings_users" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_bookings_offices" FOREIGN KEY ("office_id") REFERENCES "offices" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_bookings_working_seats" FOREIGN KEY ("working_seat_id") REFERENCES "working_seats" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Indexes for optimization
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_dates" ON "bookings" ("working_seat_id", "start_date", "end_date")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_start" ON "bookings" ("start_date")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_end" ON "bookings" ("end_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_bookings_end"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_start"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_dates"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "working_seats"`);
    await queryRunner.query(`DROP TABLE "offices"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
