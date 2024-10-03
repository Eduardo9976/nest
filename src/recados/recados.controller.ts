import {
    Body,
    Controller,
    Delete,
    Get,
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

@Controller('recados')
@UseInterceptors(AddHeaderInterceptor) // ou usar no método ou lá no global
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {
    }

    @UseInterceptors(TimingConnectionInterceptor)
    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        return await this.recadosService.findAll(paginationDto);
    }

    // usando parse int pipe para garantir que o id seja um número mas posso transfomar direto no main.ts com o ValidationPipe/ mas direto na validation o transform, pode causar uma perca de performance(transforma todos os campos uma estancia caso tenha a classe dto)
    // assim tenho ganho de performance e lança na resposta um erro caso não seja um número
    @Get(':id')
    @UsePipes(ParseIntIdPipe) // poderia colocar direto na classe para usar para todos
    // async findOne(@Param('id', ParseIntPipe) id: number) {
    async findOne(@Param('id', ParseIntPipe) id: number) {
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
