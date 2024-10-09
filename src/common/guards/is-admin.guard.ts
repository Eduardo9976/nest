import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class IsAdminGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

      console.log('passei no guard')
    // para passar retorna true e para bloquear retorna false,  is Admin ta vindo no middleware
    return request.user.isAdmin;
  }

}
