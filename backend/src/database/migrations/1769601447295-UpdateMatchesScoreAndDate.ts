import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMatchesScoreAndDate1769601447295
  implements MigrationInterface
{
  name = 'UpdateMatchesScoreAndDate1769601447295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remover a coluna scoreboard antiga
    await queryRunner.query(
      `ALTER TABLE \`matches\` DROP COLUMN \`scoreboard\``
    );

    // Adicionar as novas colunas
    await queryRunner.query(
      `ALTER TABLE \`matches\` ADD \`scoreTeam1\` int NULL AFTER \`status\``
    );
    await queryRunner.query(
      `ALTER TABLE \`matches\` ADD \`scoreTeam2\` int NULL AFTER \`scoreTeam1\``
    );
    await queryRunner.query(
      `ALTER TABLE \`matches\` ADD \`matchDate\` datetime NULL AFTER \`scoreTeam2\``
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter as mudanças: remover as novas colunas e restaurar scoreboard
    await queryRunner.query(
      `ALTER TABLE \`matches\` DROP COLUMN \`matchDate\``
    );
    await queryRunner.query(
      `ALTER TABLE \`matches\` DROP COLUMN \`scoreTeam2\``
    );
    await queryRunner.query(
      `ALTER TABLE \`matches\` DROP COLUMN \`scoreTeam1\``
    );
    await queryRunner.query(
      `ALTER TABLE \`matches\` ADD \`scoreboard\` varchar(100) NULL`
    );
  }
}
