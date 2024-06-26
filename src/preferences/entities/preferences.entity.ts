import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity({ name: 'UserPreferences' })
export class Preferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'tinyint', nullable: false, default: true })
  isPomodoroEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  toDoColumnName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  inProgressColumnName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  doneColumnName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  googleAccessToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  googleRefreshToken: string | null;

  @Column({ type: 'datetime', nullable: true, default: null })
  googleAccessTokenUpdatedAt: Date | null;

  @Column({ type: 'tinyint', nullable: false, default: false })
  isCalendarConnected: boolean;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
