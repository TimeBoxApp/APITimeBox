import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1704364787207 implements MigrationInterface {
  name = 'CreateUser1704364787207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`locale\` varchar(255) NULL, \`status\` enum ('active', 'suspended', 'deleted') NOT NULL DEFAULT 'active', \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`sex\` enum ('male', 'female', 'other') NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`User\``);
  }
}
