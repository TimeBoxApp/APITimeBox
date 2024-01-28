import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPreferences1706385671445 implements MigrationInterface {
  name = 'CreateUserPreferences1706385671445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_839c4b9360475992437b85c1e74\``);
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_fa1b5dc8af651e60fa1c5d1574c\``);
    await queryRunner.query(
      `CREATE TABLE \`UserPreferences\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`isPomodoroEnabled\` tinyint NOT NULL DEFAULT 1, \`isBookListEnabled\` tinyint NOT NULL DEFAULT 1, \`toDoColumnName\` varchar(256) NULL, \`inProgressColumnName\` varchar(256) NULL, \`doneColumnName\` varchar(256) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`User\` ADD \`dateFormat\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_fa1b5dc8af651e60fa1c5d1574c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_839c4b9360475992437b85c1e74\` FOREIGN KEY (\`taskId\`) REFERENCES \`Task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_839c4b9360475992437b85c1e74\``);
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_fa1b5dc8af651e60fa1c5d1574c\``);
    await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`dateFormat\``);
    await queryRunner.query(`DROP TABLE \`UserPreferences\``);
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_fa1b5dc8af651e60fa1c5d1574c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_839c4b9360475992437b85c1e74\` FOREIGN KEY (\`taskId\`) REFERENCES \`Task\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
