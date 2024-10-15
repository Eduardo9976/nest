import {ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {RecadoEntity} from "./entities/recado.entity";
import {CreateRecadoDto} from "./dto/create-recado.dto";
import {UpdateRecadoDto} from "./dto/update-recado.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PessoasService} from "../pessoas/pessoas.service";
import {PaginationDto} from "../common/dto/pagination.dto";
import {TokenPayloadDto} from "../auth/dto/token-payload.dto";

@Injectable()
export class RecadosService {
    constructor(
        @InjectRepository(RecadoEntity)
        private readonly recadoRepository: Repository<RecadoEntity>,
        private readonly pessoasService: PessoasService
    ) {
    }

    async findAll(paginationDto?: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;

        return await this.recadoRepository.find({
            take: limit,
            skip: offset,
            relations: ['de', 'para'],
            order: {
                id: 'desc',
            },
            select: {
                de: {
                    id: true,
                    nome: true,
                },
                para: {
                    id: true,
                    nome: true,
                },
            },
        })
    }

    async findOne(id: number) {
        const recado = await this.recadoRepository.findOne({
            where: {id},
            relations: ['de', 'para'],
            select: {
                de: {
                    id: true,
                    nome: true,
                },
                para: {
                    id: true,
                    nome: true,
                },
            },
        });

        if (recado) return recado;

        // throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
        throw new NotFoundException('Recado não encontrado');
    }

    async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto) {
        const {paraId} = createRecadoDto
        const de = await this.pessoasService.findOne(tokenPayload.sub)
        const para = await this.pessoasService.findOne(paraId)

        const novoRecado = {
            texto: createRecadoDto.texto,
            de,
            para,
            data: new Date(),
            lido: false
        };

        const recado = this.recadoRepository.create(novoRecado);
        await this.recadoRepository.save(recado);

        return {
            ...recado,
            de: {
                id: recado.de.id,
                nome: recado.de.nome,
            },
            para: {
                id: recado.para.id,
                nome: recado.para.nome
            },
        }
    }

    async update(id: number, updateRecadoDto: UpdateRecadoDto, tokenPayload: TokenPayloadDto) {
        const recado = await this.findOne(id);

        if(recado.de.id !== tokenPayload.sub) {
            throw new ForbiddenException('Você não tem permissão para alterar este recado');
        }

        recado.texto = updateRecadoDto?.texto ?? recado.texto
        recado.lido = updateRecadoDto?.lido ?? recado.lido

        return await this.recadoRepository.save(recado);
    }

    async remove(id: number, tokenPayload: TokenPayloadDto) {
        const recado = await this.findOne(id)

        if(recado.de.id !== tokenPayload.sub) {
            throw new ForbiddenException('Você não tem permissão para excluir este recado');
        }

        return this.recadoRepository.remove(recado)
    }
}
