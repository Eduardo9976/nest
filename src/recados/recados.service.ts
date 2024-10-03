import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {RecadoEntity} from "./entities/recado.entity";
import {CreateRecadoDto} from "./dto/create-recado.dto";
import {UpdateRecadoDto} from "./dto/update-recado.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PessoasService} from "../pessoas/pessoas.service";
import {PaginationDto} from "../common/dto/pagination.dto";

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

    async create(createRecadoDto: CreateRecadoDto) {
        const {deId, paraId} = createRecadoDto
        const de = await this.pessoasService.findOne(deId)
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
            },
            para: {
                id: recado.para.id,
            },
        }
    }

    async update(id: number, updateRecadoDto: UpdateRecadoDto) {
        const recado = await this.findOne(id);

        recado.texto = updateRecadoDto?.texto ?? recado.texto
        recado.lido = updateRecadoDto?.lido ?? recado.lido

        return await this.recadoRepository.save(recado);
    }

    async remove(id: number) {
        const recado = await this.recadoRepository.findOneBy({
            id
        })

        if (!recado) throw new NotFoundException('Recado não encontrado');

        return this.recadoRepository.remove(recado)
    }
}
