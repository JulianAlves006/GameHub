import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity("championship")
export class Championship {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "date", name: "start_date" })
    startDate!: Date;

    @Column({ type: "date", name: "end_date" })
    endDate!: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany("Match", "championship")
    matches!: any[];

    @OneToMany("AwardsChampionship", "championship")
    awardsChampionships!: any[];
}
