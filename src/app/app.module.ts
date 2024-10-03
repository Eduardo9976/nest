import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {RecadosModule} from "../recados/recados.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PessoasModule} from "../pessoas/pessoas.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            autoLoadEntities: true, // carrega as entidades automaticamente do diretório entities
            synchronize: true, // cria as tabelas automaticamente, não usar em produção
        }),
        RecadosModule,
        PessoasModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
