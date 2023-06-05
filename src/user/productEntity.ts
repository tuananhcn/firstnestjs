import { sessionEntity } from "src/auth/sessionEntity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
@Entity()
export class productEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;
    @Column()
    shop: string;
    // @ManyToOne(() => sessionEntity, session => session.shop)
    // @JoinColumn({ name: 'shop', referencedColumnName: 'shop' })
    // session: sessionEntity;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    body_html: string;
}