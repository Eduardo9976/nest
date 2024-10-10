import {Module} from '@nestjs/common';
import {RecadosController} from './recados.controller';
import {RecadosService} from './recados.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecadoEntity} from "./entities/recado.entity";
import {PessoasModule} from "../pessoas/pessoas.module";
import {RegexProtocol} from "../common/regex/regex.protocol";
import {RemoveSpacesRegex} from "../common/regex/remove-spaces.regex";
import {OnlyLowercaseRegex} from "../common/regex/only-lowercase.regex";
import {ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX} from "./recados.constats";
import {RegexFactory} from "../common/regex/regex.factory";
import {MyDynamicModule} from "../my-dynamic/my-dynamic.module";
import {ConfigModule} from "@nestjs/config";
import recadosConfig from "./recados.config";

@Module({
    controllers: [RecadosController],
    providers: [
        RecadosService,
        //     // para resolver só para uma classe, tudo sendo injetado e posso pegar o construtor e fazer o que quiser
        {
            provide: RegexProtocol,
            useClass: 1 === 1 ? RemoveSpacesRegex : OnlyLowercaseRegex
        },

        // para resolver para várias/ use contantes
        {
            provide: ONLY_LOWERCASE_LETTERS_REGEX,
            useClass: OnlyLowercaseRegex
        },
        {
            provide: REMOVE_SPACES_REGEX,
            useClass: RemoveSpacesRegex
        },
        // usando factory
        RegexFactory,
        {
            provide: REMOVE_SPACES_REGEX,
            // useValue: new RemoveSpacesRegex()
            useFactory: (regexFactory: RegexFactory) => regexFactory.create('RemoveSpacesRegex'),
            inject: [RegexFactory]
        },
        {
            provide: ONLY_LOWERCASE_LETTERS_REGEX,
            // useValue: new OnlyLowercaseRegex()
            // usefactory poderia ser async
            useFactory: (regexFactory: RegexFactory) => regexFactory.create('OnlyLowercaseRegex'),
            inject: [RegexFactory]
        },
    ],
    imports: [
        // ConfigModule, // só se eu quiser usar as variáveis de ambiente no módulo
        ConfigModule.forFeature(recadosConfig), // só se eu quiser usar as variáveis de ambiente forFeature
        TypeOrmModule.forFeature([RecadoEntity]),
        PessoasModule,

        // modulos dinamicos
        MyDynamicModule.register({
            apiKey: '123',
            apiUrl: 'http://localhost:3000'
        }),
    ]
})
export class RecadosModule {
}
