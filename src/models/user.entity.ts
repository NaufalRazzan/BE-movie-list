import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryColumn()
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({unique: true})
    name: string

    @Column({unique: true})
    email: string

    @Column()
    role: string

    @Column()
    password: string
}