import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

export enum WeekStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

@Entity('Week')
export class Week extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column('enum', { enum: WeekStatus, default: WeekStatus.PLANNED })
  status: WeekStatus;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: false })
  endDate: Date;

  @Column({ nullable: false })
  userId: number;

  @OneToMany(() => Task, (task) => task.week)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
