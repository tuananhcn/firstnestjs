import { sessionEntity } from "src/auth/sessionEntity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class customerEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column()
    shop: string;
    // @ManyToOne(() => sessionEntity, session => session.shop)
    // session: sessionEntity;
    
    @Column()
    name: string;

    @Column({nullable: true})
    email: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true})
    city: string;
}