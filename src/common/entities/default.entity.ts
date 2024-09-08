import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from "typeorm";

export class DefaultEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @Column({ name: 'deleted', nullable: true })
  deleted: Boolean;
}