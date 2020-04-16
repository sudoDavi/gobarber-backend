import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AlterIdFieldTypeToUUID1586990929534
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'id');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      }),
    );
    await queryRunner.dropColumn('users', 'id');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'id');

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'id',
        type: 'varchar',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      }),
    );
    await queryRunner.dropColumn('appointments', 'id');

    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'id',
        type: 'varchar',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      }),
    );
  }
}
