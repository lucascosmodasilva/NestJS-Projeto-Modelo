import { NextFunction } from "express";
import { ReqUtils } from "../utils/req.utils";
import dataSource from "../config/typeorm";
import { Token } from "src/token/entities/token.entity";
import { Equal, getConnection } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export const routesWithoutAuth: Array<string> = [
  '[POST] /api/login',
]

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (routesWithoutAuth.indexOf(`[${req.method}] ${req['originalUrl']}`) > -1
      || routesWithoutAuth.indexOf(req['originalUrl']) > -1) {
    next();
    return;
  }
  
  ReqUtils.getToken(req).then(async (token) => {
    try {
      if (!token) throw new UnauthorizedException('Token Invalido');

      const repoSession = dataSource.getRepository(Token);
      
      const session = await repoSession.findOne({
        where: {
          token: Equal(token),
        },
        relations: ['user']
      });

      if (!session) throw new UnauthorizedException('Token Invalido');
      if (session.endDate && session.endDate.getTime() < new Date().getTime())
        throw new UnauthorizedException('O Token chegou ao fim de sua vida útil');

      if (!session.user || session.user.deleted === true) 
        throw new UnauthorizedException('Usuário não existe mais ou está bloqueado');

      req['sysSession'] = session;
      next();
    } catch (e) {
      next(e);
    }
  });
};

