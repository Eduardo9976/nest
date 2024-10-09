import {CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException} from "@nestjs/common";

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers['authorization']?.split(' ')[1]

    if(!token || token !== '123456') {
      throw new UnauthorizedException('Token inválido')
    }

    return next.handle()
  }
}
