import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity("awards")
export class Award {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    description!: string;

    @Column({ type: "boolean" })
    value!: boolean;

    @Column({ type: "boolean" })
    medal!: boolean;

    @Column({ type: "boolean" })
    trophy!: boolean;

    @Column({ type: "varchar", length: 100, nullable: true })
    others!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany("AwardsChampionship", "award")
    awardsChampionships!: any[];
}
