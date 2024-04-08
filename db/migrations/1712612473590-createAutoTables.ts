import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAutoTables1712612473590 implements MigrationInterface {
  name = 'CreateAutoTables1712612473590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`emoji\` varchar(64) NULL, \`color\` varchar(64) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`Task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(1024) NULL, \`status\` enum ('created', 'to-do', 'in-progress', 'done') NOT NULL DEFAULT 'created', \`priority\` enum ('low', 'medium', 'high') NULL, \`dueDate\` date NULL, \`boardRank\` varchar(64) NULL, \`backlogRank\` varchar(64) NULL, \`weekId\` int NULL, \`userId\` int NOT NULL, \`calendarEventId\` varchar(128) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`UserPreferences\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`isPomodoroEnabled\` tinyint NOT NULL DEFAULT 1, \`toDoColumnName\` varchar(255) NULL, \`inProgressColumnName\` varchar(255) NULL, \`doneColumnName\` varchar(255) NULL, \`googleAccessToken\` varchar(255) NULL, \`googleRefreshToken\` varchar(255) NULL, \`googleAccessTokenUpdatedAt\` datetime NULL, \`isCalendarConnected\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_5f8256554b2eec66fda266f625\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`dateFormat\` enum ('DD.MM.YYYY', 'MM/DD/YYYY', 'MMM DD, YYYY') NOT NULL DEFAULT 'DD.MM.YYYY', \`status\` enum ('active', 'suspended', 'deleted') NOT NULL DEFAULT 'active', \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`sex\` enum ('male', 'female', 'other') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`Week\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('planned', 'in-progress', 'completed') NOT NULL DEFAULT 'planned', \`startDate\` datetime NOT NULL, \`endDate\` datetime NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`TaskCategory\` (\`categoryId\` int NOT NULL, \`taskId\` int NOT NULL, INDEX \`IDX_fa1b5dc8af651e60fa1c5d1574\` (\`categoryId\`), INDEX \`IDX_839c4b9360475992437b85c1e7\` (\`taskId\`), PRIMARY KEY (\`categoryId\`, \`taskId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`Category\` ADD CONSTRAINT \`FK_63e936eeeb9ecc6c95a5fc71020\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_b9a04beac0d49f34e711895715c\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_01af2d750247fa8e1e2834aca83\` FOREIGN KEY (\`weekId\`) REFERENCES \`Week\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`UserPreferences\` ADD CONSTRAINT \`FK_5f8256554b2eec66fda266f625b\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`Week\` ADD CONSTRAINT \`FK_6f117821bfedef8a2bb0f51b21e\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_fa1b5dc8af651e60fa1c5d1574c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_839c4b9360475992437b85c1e74\` FOREIGN KEY (\`taskId\`) REFERENCES \`Task\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_839c4b9360475992437b85c1e74\``);
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_fa1b5dc8af651e60fa1c5d1574c\``);
    await queryRunner.query(`ALTER TABLE \`Week\` DROP FOREIGN KEY \`FK_6f117821bfedef8a2bb0f51b21e\``);
    await queryRunner.query(`ALTER TABLE \`UserPreferences\` DROP FOREIGN KEY \`FK_5f8256554b2eec66fda266f625b\``);
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_01af2d750247fa8e1e2834aca83\``);
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_b9a04beac0d49f34e711895715c\``);
    await queryRunner.query(`ALTER TABLE \`Category\` DROP FOREIGN KEY \`FK_63e936eeeb9ecc6c95a5fc71020\``);
    await queryRunner.query(`DROP INDEX \`IDX_839c4b9360475992437b85c1e7\` ON \`TaskCategory\``);
    await queryRunner.query(`DROP INDEX \`IDX_fa1b5dc8af651e60fa1c5d1574\` ON \`TaskCategory\``);
    await queryRunner.query(`DROP TABLE \`TaskCategory\``);
    await queryRunner.query(`DROP TABLE \`Week\``);
    await queryRunner.query(`DROP TABLE \`User\``);
    await queryRunner.query(`DROP INDEX \`REL_5f8256554b2eec66fda266f625\` ON \`UserPreferences\``);
    await queryRunner.query(`DROP TABLE \`UserPreferences\``);
    await queryRunner.query(`DROP TABLE \`Task\``);
    await queryRunner.query(`DROP TABLE \`Category\``);
  }
}
