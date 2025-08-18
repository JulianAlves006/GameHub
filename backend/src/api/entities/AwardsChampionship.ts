import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Award } from "./Award.ts";
import { Championship } from "./Championship.ts";

@Entity("awards_championship")
export class AwardsChampionship {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Award, (award: Award) => award.awardsChampionships)
    @JoinColumn({ name: "award_id" })
    award!: Award;

    @ManyToOne(() => Championship, (championship: Championship) => championship.awardsChampionships)
    @JoinColumn({ name: "championship_id" })
    championship!: Championship;
}
