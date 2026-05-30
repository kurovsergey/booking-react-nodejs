"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCreatedByToOfficeAndSeat1717100000000 = void 0;
class AddCreatedByToOfficeAndSeat1717100000000 {
    name = 'AddCreatedByToOfficeAndSeat1717100000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "is_verified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "verification_token" character varying(255),
      ADD COLUMN "reset_password_token" character varying(255)
    `);
        await queryRunner.query(`
      ALTER TABLE "offices" 
      ADD COLUMN "created_by_id" uuid,
      ADD CONSTRAINT "FK_offices_users" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "working_seats" 
      ADD COLUMN "created_by_id" uuid,
      ADD CONSTRAINT "FK_working_seats_users" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    }
    async down(queryRunner) {
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
exports.AddCreatedByToOfficeAndSeat1717100000000 = AddCreatedByToOfficeAndSeat1717100000000;
//# sourceMappingURL=1717100000000-AddCreatedByToOfficeAndSeat.js.map