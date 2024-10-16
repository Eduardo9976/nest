import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import JwtConfig from "../config/jwt.config";
import {ConfigType} from "@nestjs/config";
import {REQUEST_TOKEN_PAYLOAD_KEY} from "../auth.constants";
import {InjectRepository} from "@nestjs/typeorm";
import {PessoaEntity} from "../../pessoas/entities/pessoa.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        @InjectRepository(PessoaEntity)
        private readonly pessoaRepository: Repository<PessoaEntity>,
        private readonly jwtService: JwtService,
        @Inject(JwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    ) {
    }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

            const pessoa = await this.pessoaRepository.findOneBy({
                id: payload.sub,
                active: true
            });

            if (!pessoa) {
                throw new UnauthorizedException('Pessoa não autorizada.');
            }

            payload['pessoa'] = pessoa;
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
