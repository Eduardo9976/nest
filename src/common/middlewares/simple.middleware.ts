import {NestMiddleware} from "@nestjs/common";
import {NextFunction} from "express";

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['user'] = {
        id: 1,
        name: 'John Doe',
        email: 'john@doe.com',
        isAdmin: true
    }
    next();
  }
}
