import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {RecadosModule} from "../recados/recados.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PessoasModule} from "../pessoas/pessoas.module";
import {SimpleMiddleware} from "../common/middlewares/simple.middleware";
import {MyExceptionFilter} from "../common/filters/my-exception.filter";
import {IsAdminGuard} from "../common/guards/is-admin.guard";

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
    providers: [
        AppService,
        {
            provide: 'APP_FILTER',
            useClass: MyExceptionFilter
        },
        { // também poderia usar por rota ou controller
            provide: 'APP_GUARD',
            useClass: IsAdminGuard
        }
    ],
})
// export class AppModule {}

// só para testar o middleware que também poderia ser global
export class AppModule implements NestModule {
    configure(consumer:MiddlewareConsumer) {
        consumer.apply(SimpleMiddleware).forRoutes('*');
        // consumer.apply((req, res, next) => {
        //     console.log('Request...');
        //     next();
        // }
    }
}
