import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateTicket1758569622856 implements MigrationInterface {
    name = 'GenerateTicket1758569622856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED')`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(5000), "priority" "public"."ticket_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."ticket_status_enum" NOT NULL DEFAULT 'OPEN', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_priority_enum"`);
    }

}
