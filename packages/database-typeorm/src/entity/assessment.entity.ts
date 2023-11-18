import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TestUser {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    firstName: string

    @Column('text')
    lastName: string
}