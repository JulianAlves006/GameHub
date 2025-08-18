import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team.ts";
import { Championship } from "./Championship.ts";

@Entity("matches")
export class Match {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Team, (team: Team) => team.matchesAsTeam1)
    @JoinColumn({ name: "team1" })
    team1!: Team;

    @ManyToOne(() => Team, (team: Team) => team.matchesAsTeam2)
    @JoinColumn({ name: "team2" })
    team2!: Team;

    @ManyToOne(() => Team, (team: Team) => team.matchesWon, { nullable: true })
    @JoinColumn({ name: "winner" })
    winner!: Team;

    @ManyToOne(() => Championship, (championship: Championship) => championship.matches)
    @JoinColumn({ name: "championship" })
    championship!: Championship;

    @Column({ type: "varchar", length: 50 })
    status!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    scoreboard!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
}
