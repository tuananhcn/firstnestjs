import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class customerEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({nullable: true})
    email: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true})
    city: string;
}