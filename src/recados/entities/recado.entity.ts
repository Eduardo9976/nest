import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PessoaEntity} from "../../pessoas/entities/pessoa.entity";

@Entity('recado') // se nao passar nada, ee assume o nome da classe em minusculo
export class RecadoEntity {
    @Column()
    data: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: false})
    lido: boolean;

    @Column({type: 'varchar', length: 255})
    texto: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    // Muitos recados podem ser enviados por uma única pessoa (emissor)
    // ao deletar uma pessoa, todos os recados enviados por ela também serão deletados
    // ao atualizar uma pessoa, todos os recados enviados por ela também serão atualizados
    @ManyToOne(() => PessoaEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // Especifica a coluna "de" que armazena o ID da pessoa que enviou o recado
    @JoinColumn({ name: 'de' })
    de: PessoaEntity;

    // Muitos recados podem ser enviados para uma única pessoa (destinatário)
    // ao deletar uma pessoa, todos os recados enviados para ela também serão deletados
    @ManyToOne(() => PessoaEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    // Especifica a coluna "para" que armazena o ID da pessoa que recebe o recado
    @JoinColumn({ name: 'para' })
    para: PessoaEntity;
}
