import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RecadoEntity} from "./entities/recado.entity";
import {PessoasModule} from "../pessoas/pessoas.module";

@Module({
  controllers: [RecadosController],
  providers: [RecadosService],
  imports: [
    TypeOrmModule.forFeature([RecadoEntity]),
      PessoasModule
  ]
})
export class RecadosModule {}
