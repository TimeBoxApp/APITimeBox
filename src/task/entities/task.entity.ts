import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Week } from '../../week/entities/week.entity';
import { Category } from '../../category/entities/category.entity';

export enum TaskStatus {
  CREATED = 'created',
  TO_DO = 'to-do',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

@Entity({ name: 'Task' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.CREATED })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, nullable: true })
  priority: TaskPriority | null;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  boardRank: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  backlogRank: string | null;

  @Column()
  weekId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Week, (week) => week.tasks)
  week: Week;

  @ManyToMany(() => Category, (category) => category.tasks, { cascade: ['remove'] })
  @JoinTable({ name: 'TaskCategory' })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}