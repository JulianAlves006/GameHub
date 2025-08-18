import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Gamer } from "./Gamer.ts";
import { Match } from "./Match.ts";

@Entity("teams")
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "blob", nullable: true })
    logo!: Buffer;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => Gamer, (gamer: Gamer) => gamer.team)
    gamers!: Gamer[];

    @OneToMany(() => Match, (match: Match) => match.team1)
    matchesAsTeam1!: Match[];

    @OneToMany(() => Match, (match: Match) => match.team2)
    matchesAsTeam2!: Match[];

    @OneToMany(() => Match, (match: Match) => match.winner)
    matchesWon!: Match[];
}
