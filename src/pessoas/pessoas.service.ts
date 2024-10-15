import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreatePessoaDto} from './dto/create-pessoa.dto';
import {UpdatePessoaDto} from './dto/update-pessoa.dto';
import {Repository} from "typeorm";
import {PessoaEntity} from "./entities/pessoa.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {async} from "rxjs";
import {HashingService} from "../auth/hashing/hashing.service";
import {TokenPayloadDto} from "../auth/dto/token-payload.dto";

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
        const pessoa = this.pessoaRepository.findOne({
            where: {id}
        })

        if (pessoa) return pessoa;

        throw new NotFoundException('Pessoa não encontrada');
    }

    async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {
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

        if (pessoa.id !== tokenPayload.sub) throw new NotFoundException('Você não é essa pessoa');

        const { passwordHash, ...updatedPessoa } = await this.pessoaRepository.save(pessoa);

        return updatedPessoa;
    }

    async remove(id: number, tokenPayload: TokenPayloadDto) {
        const pessoa = await this.pessoaRepository.findOne({
            where: {id}
        })

        if (pessoa.id !== tokenPayload.sub) throw new NotFoundException('Você não é essa pessoa');

        if (pessoa) return await this.pessoaRepository.remove(pessoa);

        throw new NotFoundException('Pessoa não encontrada');
    }
}
