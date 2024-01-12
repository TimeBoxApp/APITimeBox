import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskCascadeDeleteCategory1704991609013 implements MigrationInterface {
  name = 'AddTaskCascadeDeleteCategory1704991609013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`emoji\` varchar(255) NULL, \`color\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`TaskCategory\` (\`categoryId\` int NOT NULL, \`taskId\` int NOT NULL, INDEX \`IDX_fa1b5dc8af651e60fa1c5d1574\` (\`categoryId\`), INDEX \`IDX_839c4b9360475992437b85c1e7\` (\`taskId\`), PRIMARY KEY (\`categoryId\`, \`taskId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`Category\` ADD CONSTRAINT \`FK_63e936eeeb9ecc6c95a5fc71020\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_fa1b5dc8af651e60fa1c5d1574c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_839c4b9360475992437b85c1e74\` FOREIGN KEY (\`taskId\`) REFERENCES \`Task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_839c4b9360475992437b85c1e74\``);
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_fa1b5dc8af651e60fa1c5d1574c\``);
    await queryRunner.query(`ALTER TABLE \`Category\` DROP FOREIGN KEY \`FK_63e936eeeb9ecc6c95a5fc71020\``);
    await queryRunner.query(`DROP INDEX \`IDX_839c4b9360475992437b85c1e7\` ON \`TaskCategory\``);
    await queryRunner.query(`DROP INDEX \`IDX_fa1b5dc8af651e60fa1c5d1574\` ON \`TaskCategory\``);
    await queryRunner.query(`DROP TABLE \`TaskCategory\``);
    await queryRunner.query(`DROP TABLE \`Category\``);
  }
}
