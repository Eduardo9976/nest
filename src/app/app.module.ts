import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {RecadosModule} from "../recados/recados.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PessoasModule} from "../pessoas/pessoas.module";
import {SimpleMiddleware} from "../common/middlewares/simple.middleware";
import {MyExceptionFilter} from "../common/filters/my-exception.filter";
import {IsAdminGuard} from "../common/guards/is-admin.guard";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as Joi from '@hapi/joi';
import appConfig from "./app.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig], // carregando configurações de um arquivo

            validationSchema: Joi.object({ // não precisaria do joi, mas é uma boa prática
                DATABASE_TYPE: Joi.string().required(),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().required(),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_DATABASE: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_AUTOLOADENTITIES: Joi.number().required().min(0).max(1).default(0),
                DATABASE_SYNCHRONIZE: Joi.number().required().min(0).max(1).default(0)
            })
        }), // posso ter configuracoes por exemplo envFilePath: '.env.development' ou ignoreEnvFile: true
        // TypeOrmModule.forRoot({
        //     type: process.env.DATABASE_TYPE as 'postgres',
        //     host: process.env.DATABASE_HOST,
        //     port: +process.env.DATABASE_PORT,
        //     username: process.env.DATABASE_USERNAME,
        //     database: process.env.DATABASE_DATABASE,
        //     password: process.env.DATABASE_PASSWORD,
        //     autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega entidades sem precisar especifica-las
        //     synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // Sincroniza com o BD. Não deve ser usado em produção
        // }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: configService.get<'postgres'>('database.type'),
                    host: configService.get<string>('database.host'),
                    port: configService.get<number>('database.port'),
                    username: configService.get<string>('database.username'),
                    database: configService.get<string>('database.database'),
                    password: configService.get<string>('database.password'),
                    autoLoadEntities: configService.get<boolean>(
                        'database.autoLoadEntities',
                    ),
                    synchronize: configService.get<boolean>('database.synchronize'),
                };
            },
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
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SimpleMiddleware).forRoutes('*');
        // consumer.apply((req, res, next) => {
        //     console.log('Request...');
        //     next();
        // }
    }
}
