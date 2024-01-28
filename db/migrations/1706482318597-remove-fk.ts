import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFk1706482318597 implements MigrationInterface {
  name = 'RemoveFk1706482318597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_839c4b9360475992437b85c1e74\``);
    await queryRunner.query(`ALTER TABLE \`TaskCategory\` DROP FOREIGN KEY \`FK_fa1b5dc8af651e60fa1c5d1574c\``);
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_01af2d750247fa8e1e2834aca83\``);
    await queryRunner.query(`ALTER TABLE \`Task\` CHANGE \`weekId\` \`weekId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_01af2d750247fa8e1e2834aca83\` FOREIGN KEY (\`weekId\`) REFERENCES \`Week\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
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
    await queryRunner.query(`ALTER TABLE \`Task\` DROP FOREIGN KEY \`FK_01af2d750247fa8e1e2834aca83\``);
    await queryRunner.query(`ALTER TABLE \`Task\` CHANGE \`weekId\` \`weekId\` int NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`Task\` ADD CONSTRAINT \`FK_01af2d750247fa8e1e2834aca83\` FOREIGN KEY (\`weekId\`) REFERENCES \`Week\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_fa1b5dc8af651e60fa1c5d1574c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`TaskCategory\` ADD CONSTRAINT \`FK_839c4b9360475992437b85c1e74\` FOREIGN KEY (\`taskId\`) REFERENCES \`Task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
