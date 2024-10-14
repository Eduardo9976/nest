import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import JwtConfig from "../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {REQUEST_TOKEN_PAYLOAD_KEY} from "../auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    ) {}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
            return true;
        } catch (e) {
            throw new UnauthorizedException(e.message);
        }
    }

    extractTokenFromHeader(request: Request) {
        return request.headers['authorization']?.replace('Bearer ', '');
    }
}
