import { Body, Controller, Post } from "@nestjs/common";
import { LoginService } from "./login.service";
import { LoginDto } from "./dto/login.dto";
import { ReadLoginDto } from "./dto/read-login.dto";

@Controller('api/login')
export class LoginController {
  constructor(private readonly service: LoginService) {}

  @Post()
  async login(
    @Body() data: LoginDto,
  ): Promise<ReadLoginDto> {
    return await this.service.login(data);
  }
}