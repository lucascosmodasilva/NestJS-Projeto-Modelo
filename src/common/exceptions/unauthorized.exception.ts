import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedException extends HttpException {
  constructor(message) {
    super(message || 'Authenticação invalida', HttpStatus.UNAUTHORIZED);
  }
}