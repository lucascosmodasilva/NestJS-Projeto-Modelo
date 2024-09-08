import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "src/token/entities/token.entity";
import { User } from "src/user/entities/user.entity";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}