import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsEmail} from "class-validator";
import {RecadoEntity} from "../../recados/entities/recado.entity";
import {RoutePolicies} from "../../auth/enum/route-policies.enum";

@Entity('pessoa')
export class PessoaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @IsEmail()
    email: string;

    @Column({length: 255})
    passwordHash: string;

    @Column({length: 100})
    nome: string;

    @CreateDateColumn()
    createdAd?: Date;

    @UpdateDateColumn()
    updateAt?: Date;

    // Uma pessoa pode ter enviado muitos recados (como "de")
    // Esses recados são relacionados ao campo "de" na entidade recado
    @OneToMany(() => RecadoEntity, recado => recado.de)
    recadosEnviados: RecadoEntity[];

    // Uma pessoa pode ter recebido muitos recados (como "para")
    // Esses recados são relacionados ao campo "para" na entidade recado
    @OneToMany(() => RecadoEntity, recado => recado.para)
    recadosRecebidos: RecadoEntity[];

    @Column({default: true})
    active: boolean;

    @Column({ type: 'simple-array', default: [] })
    routePolicies: RoutePolicies[];
}
