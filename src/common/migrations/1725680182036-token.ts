import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class Token1725680182036 implements MigrationInterface {
    private table: Table = new Table({
        name: 'tokens',
        columns: [
            new TableColumn({
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                isNullable: false,
            }),
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                isNullable: false,
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                isNullable: false,
            }),
            new TableColumn({
                name: 'deleted',
                type: 'boolean',
                isNullable: true,
            }),
            new TableColumn({
                name: 'user_id',
                type: 'int',
                isNullable: false,
            }),
            new TableColumn({
                name: 'token',
                type: 'varchar',
                length: '250',
                isNullable: false,
            }),
            new TableColumn({
                name: 'end_date',
                type: 'timestamp',
                isNullable: true,
            }),
            new TableColumn({
                name: 'login_in_web',
                type: 'boolean',
                isNullable: true,
            }),
        ]
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table, true);
        
        await queryRunner.createForeignKey(this.table, 
        new TableForeignKey({
            name: 'fk_token_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(this.table, 'fk_token_user_id');
        await queryRunner.dropTable(this.table, true);
    }
}
