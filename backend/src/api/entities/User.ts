import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Gamer } from './Gamer.ts';
import { Log } from './Log.ts';
import { Notifications } from './Notifications.ts';
import { Championship } from './Championship.ts';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50 })
  profile!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Gamer, (gamer: Gamer) => gamer.user)
  gamers!: Gamer[];

  @OneToMany(() => Log, (log: Log) => log.user)
  logs!: Log[];

  @OneToMany(
    () => Notifications,
    (notification: Notifications) => notification.user
  )
  notification!: Notifications[];

  @Column({ type: 'tinyint', name: 'is_active' })
  isActive!: number;

  @OneToMany(
    () => Championship,
    (championship: Championship) => championship.admin
  )
  championships!: Championship[];
}
