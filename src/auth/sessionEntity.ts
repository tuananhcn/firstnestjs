import { productEntity } from "src/user/productEntity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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