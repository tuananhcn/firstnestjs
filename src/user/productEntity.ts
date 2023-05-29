import { Column, Entity, PrimaryGeneratedColumn} from "typeorm"
@Entity()
export class productEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    body_html: string;
}