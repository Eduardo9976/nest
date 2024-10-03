import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength} from "class-validator";

export class CreatePessoaDto {
    @IsEmail()
    email: string;

    // @IsStrongPassword({
    //     minLength: 8,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minNumbers: 1,
    //     minSymbols: 1,
    // })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    nome: string;
}
