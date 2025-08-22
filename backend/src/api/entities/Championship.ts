import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Match } from "./Match.ts";
import { AwardsChampionship } from "./AwardsChampionship.ts";
import { User } from "./User.ts";

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

    @Column({ type: "int", name: "admin_id" })
    adminId!: number;

    @ManyToOne(() => User, (user: User) => user.championships)
    @JoinColumn({ name: "admin_id" })
    admin!: User;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => Match, (match: Match) => match.championship)
    matches!: Match[];

    @OneToMany(() => AwardsChampionship, (awardsChampionship: AwardsChampionship) => awardsChampionship.championship)
    awardsChampionships!: AwardsChampionship[];
}
