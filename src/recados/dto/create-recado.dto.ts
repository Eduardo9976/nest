import {IsBoolean, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength,} from "class-validator";

export class CreateRecadoDto {
    @IsPositive()
    paraId: number;

    @IsString()
    @IsNotEmpty()
    readonly texto: string;

    @IsBoolean()
    @IsOptional()
    readonly lido?: boolean;
}
