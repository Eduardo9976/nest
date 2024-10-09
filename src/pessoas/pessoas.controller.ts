import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, Req} from '@nestjs/common';
import {PessoasService} from './pessoas.service';
import {CreatePessoaDto} from './dto/create-pessoa.dto';
import {UpdatePessoaDto} from './dto/update-pessoa.dto';
import {SimpleCacheInterceptor} from "../common/interceptors/simple-cache.interceptor";
import {ChangeDataInterceptor} from "../common/interceptors/change-data.interceptor";
import {AuthTokenInterceptor} from "../common/interceptors/auth-token.interceptor";

@UseInterceptors(AuthTokenInterceptor, SimpleCacheInterceptor, ChangeDataInterceptor)
@Controller('pessoas')
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {
    }

    @Post()
    create(@Body() createPessoaDto: CreatePessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }

    // @UseInterceptors(AuthTokenInterceptor)
    @Get()
    findAll( @Req() req: Request) {
        console.log('User:', req['user']);
        return this.pessoasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pessoasService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePessoaDto: UpdatePessoaDto) {
        return this.pessoasService.update(id, updatePessoaDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.pessoasService.remove(id);
    }
}
