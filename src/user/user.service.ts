import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, Like, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { plainToClass } from 'class-transformer';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { Pagination } from 'src/common/dto/pagination.dto';
import { UserQueryParamDto } from './dto/user-query-param.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) { }

  async paginate(
    params: UserQueryParamDto,
  ): Promise<Pagination<CreateUserDto>> {
    const { take, skip, q, orderBy, orderDesc } = params;

    let where = {};
    if (q) where = [
      { name: Like(`%${q}%`), deleted: Equal(false) },
      { email: Like(`%${q}%`), deleted: Equal(false) },
    ]

    let order = {};
    order[orderBy || 'id'] = orderDesc === true ? 'DESC' : 'ASC';
    const [ result, count ] = await this.repository.findAndCount({
      take: take ?? 10,
      skip: skip ?? 0,
      where,
      order,
    });

    const item = plainToClass(ReadUserDto, result);
    return new Pagination<ReadUserDto>(item, count);
  }

  async create(
    data: CreateUserDto
  ): Promise<ReadUserDto> {
    await this.validation(null, data);
    data.emailVerified = false;

    const created = await this.repository.save(data);
    return plainToClass(ReadUserDto, created);
  }

  async update(
    id: number,
    data: UpdateUserDto
  ): Promise<ReadUserDto> {
    if (id <= 0) throw new BadRequestException('Usuário invalido');
    
    const finded = await this.repository.findOne({
      where: {
        id: Equal(id),
        deleted: Not(true),
      }
    });

    if (!finded) throw new BadRequestException('Usuário invalido');

    if (!data.password) {
      data.password = finded.password;
      data.repassword = finded.password;
    } else {
      data.password = await CryptoUtils.encript(data.password);
      data.repassword = await CryptoUtils.encript(data.repassword);
    }

    if (data.password !== data.repassword)
      throw new BadRequestException('As senhas não são iguais');

    await this.validation(null, data);

    data.emailVerified = finded.emailVerified;
    data.emailVerificationToken = finded.emailVerificationToken;

    const updateRaw = await this.repository.update({ 
      id: Equal(id),
    }, data);

    if (updateRaw.affected <= 0) throw new BadRequestException('Erro ao salvar o usuário');

    const userReturn = await this.repository.findOne({
      where: {
        id: Equal(id),
        deleted: Not(true),
      }
    });
    return plainToClass(ReadUserDto, userReturn);
  }

  async delete(
    id: number,
  ): Promise<void> {
    if (id <= 0) throw new BadRequestException('Usuário invalido');
    const updateRaw = await this.repository.update({
      id: Equal(id),
    }, {
      deleted: true,
    });

    if (updateRaw.affected <= 0) throw new BadRequestException('Erro ao salvar o usuário');
  }

  private async validation(
    id?: number,
    data?: CreateUserDto | UpdateUserDto,
  ): Promise<void> {
    if (!data) throw new BadRequestException('Nenhum informação encontrada');

    if (!data.email) throw new BadRequestException('Email invalido');
    
    const emailFinded = await this.repository.findOne({
      where: {
        email: Equal(data.email),
      }
    });

    if (emailFinded && emailFinded.id !== id)
      throw new BadRequestException('Email já existe no sistema');

    if (!data.password)
      throw new BadRequestException('A Senha não pode ser vazia');
  }
}
