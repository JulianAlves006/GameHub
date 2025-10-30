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
import { AwardsChampionship } from './AwardsChampionship.ts';
import { User } from './User.ts';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  description!: string;

  @Column({ type: 'tinyint' })
  value!: number;

  @Column({ type: 'tinyint' })
  medal!: number;

  @Column({ type: 'tinyint' })
  trophy!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  others!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user: User) => user.championships)
  @JoinColumn({ name: 'admin_id' })
  admin!: User;

  @OneToMany(
    () => AwardsChampionship,
    (awardsChampionship: AwardsChampionship) => awardsChampionship.award
  )
  awardsChampionships!: AwardsChampionship[];
}
