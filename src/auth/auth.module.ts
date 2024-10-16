import {Global, Module} from "@nestjs/common";
import {HashingService} from "./hashing/hashing.service";
import {BcryptService} from "./hashing/bcrypt.service";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PessoaEntity} from "../pessoas/entities/pessoa.entity";
import {ConfigModule} from "@nestjs/config";
import JwtConfig from "./config/jwt.config";
import {JwtModule, JwtService} from "@nestjs/jwt";

@Global()
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService
        },
        AuthService
    ],
    exports: [HashingService, JwtModule, ConfigModule, TypeOrmModule],
    imports: [
        TypeOrmModule.forFeature([PessoaEntity]),
        ConfigModule.forFeature(JwtConfig),
        JwtModule.registerAsync(JwtConfig.asProvider())
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule {

}
