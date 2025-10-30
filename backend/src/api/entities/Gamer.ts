import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Team } from './Team.ts';
import { User } from './User.ts';
import { Notifications } from './Notifications.ts';
import { Metric } from './Metric.ts';

@Entity('gamers')
export class Gamer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Team, (team: Team) => team.gamers)
  @JoinColumn({ name: 'team' })
  team!: Team;

  @OneToMany(
    () => Notifications,
    (notification: Notifications) => notification.user
  )
  notification!: Notifications[];

  @Column({ type: 'int', name: 'shirtNumber' })
  shirtNumber!: number;

  @Column({ type: 'int' })
  score!: number;

  @ManyToOne(() => User, (user: User) => user.gamers)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Metric, (metric: Metric) => metric.gamer)
  metrics!: Metric[];
}
