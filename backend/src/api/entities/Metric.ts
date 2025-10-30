import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from './Match.ts';
import { Gamer } from './Gamer.ts';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match!: Match;

  @ManyToOne(() => Gamer, { nullable: true })
  @JoinColumn({ name: 'gamer_id' })
  gamer!: Gamer | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
