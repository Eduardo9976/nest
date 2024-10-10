import {
    Body,
    Controller,
    Delete,
    Get, Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import {UpdateRecadoDto} from "./dto/update-recado.dto";
import {CreateRecadoDto} from "./dto/create-recado.dto";
import {PaginationDto} from "../common/dto/pagination.dto";
import {ParseIntIdPipe} from "../common/pipes/parse-int-id.pipe";
import {AddHeaderInterceptor} from "../common/interceptors/add-header.interceptor";
import {TimingConnectionInterceptor} from "../common/interceptors/timing-connection.interceptor";
import {ErrorHandlingInterceptor} from "../common/interceptors/error-handling.interceptor";
import {ReqDataParam} from "../common/params/req-data-param.decorator";
import {RegexProtocol} from "../common/regex/regex.protocol";
import {ONLY_LOWERCASE_LETTERS_REGEX} from "./recados.constats";
import {MY_DYNAMIC_CONFIG, MyDynamicModuleConfigs} from "../my-dynamic/my-dynamic.module";
import {ConfigService} from "@nestjs/config";

@Controller('recados')
@UseInterceptors(AddHeaderInterceptor) // ou usar no método ou lá no global
export class RecadosController {
    constructor(
        private readonly configService: ConfigService,

        private readonly recadosService: RecadosService,
        // recebendo a injeção de dependência
        private readonly regexProtocol: RegexProtocol,

        @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
        private readonly removeSpacesRegex: RegexProtocol,

        @Inject(MY_DYNAMIC_CONFIG)
        private readonly myDynamicConfig: MyDynamicModuleConfigs
    ) {
    }

    @UseInterceptors(TimingConnectionInterceptor)
    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        console.log('usando var de ambientes pelo inject do module', this.configService.get('DATABASE_HOST'))
        console.log(this.regexProtocol.execute('Teste de Regex'))
        console.log(this.removeSpacesRegex.execute('Teste de Regex'))
        console.log('injetado do modulo dinamico', this.myDynamicConfig)
        return await this.recadosService.findAll(paginationDto);
    }

    // usando parse int pipe para garantir que o id seja um número mas posso transfomar direto no main.ts com o ValidationPipe/ mas direto na validation o transform, pode causar uma perca de performance(transforma todos os campos uma estancia caso tenha a classe dto)
    // assim tenho ganho de performance e lança na resposta um erro caso não seja um número
    @Get(':id')
    @UsePipes(ParseIntIdPipe) // poderia colocar direto na classe para usar para todos
    // async findOne(@Param('id', ParseIntPipe) id: number) {
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        // aquele data do decorator é o que passo no decorator @UrlParam('data')
        @ReqDataParam('url') url: string) {
        console.log(url, 'pelo custom decorator');
        return await this.recadosService.findOne(id);
    }

    // @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createRecadoDto: CreateRecadoDto) {
        return await this.recadosService.create(createRecadoDto);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateRecadoDto: UpdateRecadoDto) {
        return await this.recadosService.update(id, updateRecadoDto);
    }

    @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.recadosService.remove(id);
    }
}
