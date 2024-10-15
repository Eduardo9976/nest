import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginDto} from './dto/login.dto';
import {Repository} from 'typeorm';
import {PessoaEntity} from 'src/pessoas/entities/pessoa.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {HashingService} from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import {ConfigType} from '@nestjs/config';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PessoaEntity)
        private readonly pessoaRepository: Repository<PessoaEntity>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(loginDto: LoginDto) {
        const pessoa = await this.pessoaRepository.findOneBy({
            email: loginDto.email,
        });

        if (!pessoa) {
            throw new UnauthorizedException('Pessoa não existe.');
        }

        const passwordIsValid = await this.hashingService.compare(
            loginDto.password,
            pessoa.passwordHash,
        );

        if (!passwordIsValid) {
            throw new UnauthorizedException('Senha inválida!');
        }


        const accessToken = await this.jwtService.signAsync(
            {
                sub: pessoa.id,
                email: pessoa.email,
            }, {
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            }
        )

        return {accessToken}
    }
}
