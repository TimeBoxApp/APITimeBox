import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeekAndTask1704916870480 implements MigrationInterface {
  name = 'CreateWeekAndTask1704916870480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(1024) NULL, \`status\` enum ('created', 'to-do', 'in-progress', 'done') NOT NULL DEFAULT 'created', \`priority\` enum ('low', 'medium', 'high') NULL, \`dueDate\` date NULL, \`boardRank\` varchar(512) NULL, \`backlogRank\` varchar(512) NULL, \`weekId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`Week\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('planned', 'in-progress', 'completed') NOT NULL DEFAULT 'planned', \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_b9a04beac0d49f34e711895715c\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_01af2d750247fa8e1e2834aca83\` FOREIGN KEY (\`weekId\`) REFERENCES \`Week\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`Week\` ADD CONSTRAINT \`FK_6f117821bfedef8a2bb0f51b21e\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Week\` DROP FOREIGN KEY \`FK_6f117821bfedef8a2bb0f51b21e\``);
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_01af2d750247fa8e1e2834aca83\``);
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_b9a04beac0d49f34e711895715c\``);
    await queryRunner.query(`DROP TABLE \`Week\``);
    await queryRunner.query(`DROP TABLE \`Task\``);
  }
}
