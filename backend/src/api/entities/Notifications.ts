import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.ts';
import { Gamer } from './Gamer.ts';
import { Team } from './Team.ts';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user: User) => user.notification)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Gamer, (gamer: Gamer) => gamer.notification)
  @JoinColumn({ name: 'gamer_id' })
  gamer!: Gamer;

  @ManyToOne(() => Team, (team: Team) => team.notifications, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team!: Team | null;

  @Column({ type: 'varchar', length: 100 })
  type!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'tinyint', name: 'read' })
  read!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
