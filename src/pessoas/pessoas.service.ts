import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreatePessoaDto} from './dto/create-pessoa.dto';
import {UpdatePessoaDto} from './dto/update-pessoa.dto';
import {Repository} from "typeorm";
import {PessoaEntity} from "./entities/pessoa.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {async} from "rxjs";
import {HashingService} from "../auth/hashing/hashing.service";

@Injectable()
export class PessoasService {
    constructor(
        @InjectRepository(PessoaEntity)
        private readonly pessoaRepository: Repository<PessoaEntity>,
        private readonly hashingService: HashingService
    ) {
    }

    async create(createPessoaDto: CreatePessoaDto) {
        try {
            const passwordHash = await this.hashingService.hash(createPessoaDto.password);

            const pessoaData = {
                nome: createPessoaDto.nome,
                email: createPessoaDto.email,
                passwordHash
            }

            const novaPessoa = this.pessoaRepository.create(pessoaData);

            await this.pessoaRepository.save(novaPessoa);

            const { passwordHash: _, ...pessoa } = novaPessoa;

            return pessoa;
        } catch (error) {
            if (error.code === '23505') throw new ConflictException('E-mail já cadastrado')
            throw error;
        }
    }

    async findAll() {
        return await this.pessoaRepository.find(
            {
                order: {
                    id: 'DESC'
                }
            }
        )
    }

    async findOne(id: number) {
        const pesssoa = this.pessoaRepository.findOne({
            where: {id}
        })

        if (pesssoa) return pesssoa;

        throw new NotFoundException('Pessoa não encontrada');
    }

    async update(id: number, updatePessoaDto: UpdatePessoaDto) {
        const partialPessoaDto = {
            nome: updatePessoaDto?.nome
        }

        if (updatePessoaDto?.password) {
            partialPessoaDto['passwordHash'] = await this.hashingService.hash(updatePessoaDto.password);
        }

        const pessoa = await this.pessoaRepository.preload({
            id,
            ...partialPessoaDto
        })

        if (!pessoa) throw new NotFoundException('Pessoa não encontrada');

        const { passwordHash, ...updatedPessoa } = await this.pessoaRepository.save(pessoa);

        return updatedPessoa;
    }

    async remove(id: number) {
        const pesssoa = await this.pessoaRepository.findOne({
            where: {id}
        })

        if (pesssoa) return await this.pessoaRepository.remove(pesssoa);

        throw new NotFoundException('Pessoa não encontrada');
    }
}
