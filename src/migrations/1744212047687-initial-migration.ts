import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1744212047687 implements MigrationInterface {
  name = 'InitialMigration1744212047687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stock" ALTER COLUMN "sma_last_ten" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stock" ALTER COLUMN "sma_last_ten" SET NOT NULL`);
  }
}
