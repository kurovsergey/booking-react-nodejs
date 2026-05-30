import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToOfficeAndSeat1717100000000 implements MigrationInterface {
  name = 'AddCreatedByToOfficeAndSeat1717100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter users table
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "is_verified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "verification_token" character varying(255),
      ADD COLUMN "reset_password_token" character varying(255)
    `);

    // Alter offices table
    await queryRunner.query(`
      ALTER TABLE "offices" 
      ADD COLUMN "created_by_id" uuid,
      ADD CONSTRAINT "FK_offices_users" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Alter working_seats table
    await queryRunner.query(`
      ALTER TABLE "working_seats" 
      ADD COLUMN "created_by_id" uuid,
      ADD CONSTRAINT "FK_working_seats_users" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "working_seats" DROP CONSTRAINT "FK_working_seats_users"`);
    await queryRunner.query(`ALTER TABLE "working_seats" DROP COLUMN "created_by_id"`);

    await queryRunner.query(`ALTER TABLE "offices" DROP CONSTRAINT "FK_offices_users"`);
    await queryRunner.query(`ALTER TABLE "offices" DROP COLUMN "created_by_id"`);

    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "reset_password_token",
      DROP COLUMN "verification_token",
      DROP COLUMN "is_verified"
    `);
  }
}
