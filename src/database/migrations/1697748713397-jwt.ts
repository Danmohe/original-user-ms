import { MigrationInterface, QueryRunner } from "typeorm";

export class Jwt1697748713397 implements MigrationInterface {
    name = 'Jwt1697748713397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "jwt" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jwt"`);
    }

}
