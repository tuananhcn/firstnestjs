import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class sessionEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    shop: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: false })
    isOnline: boolean;

    @Column()
    accessToken: string;

    @Column()
    scope: string;
}