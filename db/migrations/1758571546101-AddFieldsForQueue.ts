import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsForQueue1758571546101 implements MigrationInterface {
    name = 'AddFieldsForQueue1758571546101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "sla_due_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "notified_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "resolved_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "notify_job_id" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "sla_job_id" character varying(128)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "sla_job_id"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "notify_job_id"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "resolved_at"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "notified_at"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "sla_due_at"`);
    }

}
