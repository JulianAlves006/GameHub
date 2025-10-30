import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gamer } from './Gamer.ts';
import { Match } from './Match.ts';
import { Notifications } from './Notifications.ts';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'longblob', nullable: true })
  logo!: Buffer;

  @ManyToOne(() => Gamer, (gamer: Gamer) => gamer.team)
  @JoinColumn({ name: 'gamer_id' })
  gamer!: Gamer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Gamer, (gamer: Gamer) => gamer.team)
  gamers!: Gamer[];

  @OneToMany(
    () => Notifications,
    (notifications: Notifications) => notifications.team
  )
  notifications!: Notifications[];

  @OneToMany(() => Match, (match: Match) => match.team1)
  matchesAsTeam1!: Match[];

  @OneToMany(() => Match, (match: Match) => match.team2)
  matchesAsTeam2!: Match[];

  @OneToMany(() => Match, (match: Match) => match.winner)
  matchesWon!: Match[];
}
