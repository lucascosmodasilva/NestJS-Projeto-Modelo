import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException } from "src/common/exceptions/bad-request.exception";
import { CryptoUtils } from "src/common/utils/crypto.utils";
import { Token } from "src/token/entities/token.entity";
import { User } from "src/user/entities/user.entity";
import { Equal, Repository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from "./dto/login.dto";
import { ReadLoginDto } from "./dto/read-login.dto";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
  ) { }

  async login(
    data: LoginDto
  ): Promise<ReadLoginDto> {
    if(!data) throw new BadRequestException('Email ou Senha invalidos');
    if (!data.email) throw new BadRequestException('Email invalido');
    if (!data.password) throw new BadRequestException('Senha invalido');

    data.password = await CryptoUtils.encript(data.password);
    const user = await this.repository.findOne({
      where: {
        email: Equal(data.email),
        password: Equal(data.password),
      },
    });

    if (!user) throw new BadRequestException('Email ou Senha invalidos');
    const endDate = new Date(new Date().getTime() + 2.592e+9);
    const currentDate = new Date();
    const token = await this.tokenRepository.save({
      token: uuidv4(),
      loginInWeb: true,
      userId: user.id,
      endDate,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      token: token.token,
    } as ReadLoginDto;
  }
}