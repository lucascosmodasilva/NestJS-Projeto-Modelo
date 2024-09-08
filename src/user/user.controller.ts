import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Pagination } from 'src/common/dto/pagination.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UserQueryParamDto } from './dto/user-query-param.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async get(
    @Query() params: UserQueryParamDto,
  ): Promise<Pagination<ReadUserDto>> {
    return await this.service.paginate(params);
  }
  
  @Post()
  async post(
    @Body() data: CreateUserDto,
  ): Promise<ReadUserDto> {
    return await this.service.create(data);
  }
  
  @Put(':id')
  async put(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
