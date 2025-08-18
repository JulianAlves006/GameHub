import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team.ts";
import { User } from "./User.ts";

@Entity("gamers")
export class Gamer {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Team, (team: Team) => team.gamers)
    @JoinColumn({ name: "team" })
    team!: Team;

    @Column({ type: "int", name: "shirtNumber" })
    shirtNumber!: number;

    @Column({ type: "int" })
    score!: number;

    @ManyToOne(() => User, (user: User) => user.gamers)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
}
