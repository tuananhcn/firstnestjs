import { sessionEntity } from "src/auth/sessionEntity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class customerEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;
    
    @Column({ nullable: false })
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

    @ManyToOne(() => sessionEntity, session =>session.customers, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'shop', referencedColumnName: 'shop'})
    session: sessionEntity;
}