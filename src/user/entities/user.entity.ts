import { DefaultEntity } from "src/common/entities/default.entity";
import { Token } from "src/token/entities/token.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: 'users',
})
export class User extends DefaultEntity {

  @Column({ name: 'name', nullable: true, length: 100 })
  name?: string;

  @Column({ name: 'email', nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ name: 'password', nullable: false, length: 22 })
  password: string;

  @Column({ name: 'email_verified', nullable: false, default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', nullable: true, length: 22 })
  emailVerificationToken?: string;

  @OneToMany(type => Token, token => token.user)
  tokens: Token[];
}
