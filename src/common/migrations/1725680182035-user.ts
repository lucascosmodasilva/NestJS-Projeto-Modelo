import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CryptoUtils } from "../utils/crypto.utils";

export class User1725680182035 implements MigrationInterface {
    private table: Table = new Table({
        name: 'users',
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
                name: 'name',
                type: 'varchar',
                length: '100',
                isNullable: true,
            }),
            new TableColumn({
                name: 'email',
                type: 'varchar',
                length: '100',
                isNullable: false,
            }),
            new TableColumn({
                name: 'password',
                type: 'varchar',
                length: '22',
                isNullable: false,
            }),
            new TableColumn({
                name: 'email_verified',
                type: 'boolean',
                default: false,
                isNullable: false,
            }),
            new TableColumn({
                name: 'email_verification_token',
                type: 'varchar',
                length: '30',
                isNullable: true,
            }),
        ]
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table, true);

        // SEED USER
        const currentDate = new Date(new Date().getTime() - 1.08e+7).toISOString();
        const passCripto = await CryptoUtils.encript('admin');
        await queryRunner.query(`INSERT INTO "users"(created_at, updated_at, name, email, password, email_verified)
            VALUES ('${currentDate}', '${currentDate}', 'Administrador', 'admin@admin.com', '${passCripto}', true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table, true);
    }
}
