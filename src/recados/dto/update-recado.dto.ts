import {CreateRecadoDto} from "./create-recado.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {}
