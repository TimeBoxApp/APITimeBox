import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity({ name: 'UserPreferences' })
export class Preferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'tinyint', nullable: false, default: true })
  isPomodoroEnabled: boolean;

  @Column({ type: 'tinyint', nullable: false, default: true })
  isBookListEnabled: boolean;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  toDoColumnName: string;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  inProgressColumnName: string;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  doneColumnName: string;

  @OneToOne(() => User, (user) => user.preferences)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
