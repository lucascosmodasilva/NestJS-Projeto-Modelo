import { DefaultEntity } from "src/common/entities/default.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({
  name: 'tokens',
})
export class Token extends DefaultEntity {
  
  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @ManyToOne(type => User, user => user.tokens, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'token', nullable: false, length: 250 })
  token: string;

  @Column({ name: 'end_date', nullable: false })
  endDate?: Date;

  @Column({ name: 'login_in_web', nullable: true })
  loginInWeb?: Boolean;
}