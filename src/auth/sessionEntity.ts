import { customerEntity } from "src/user/customerEntity";
import { productEntity } from "src/user/productEntity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class sessionEntity{
    @Column({ unique: true,nullable: false })
    shop: string;
    @PrimaryColumn()
    id: string;
    
    
    @Column({ nullable: false })
    state: string;
    
    @Column({ nullable: false })
    isOnline: boolean;
    
    @Column()
    accessToken: string;
    
    @Column()
    scope: string;
    
    @OneToMany(() => customerEntity, customer => customer.session)
    customers: customerEntity[];

    @OneToMany(() => productEntity, product => product.session)
    products: productEntity[];
    
}