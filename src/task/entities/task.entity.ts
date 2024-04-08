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

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.CREATED })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, nullable: true })
  priority: TaskPriority | null;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  boardRank: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  backlogRank: string | null;

  @Column({ nullable: true })
  weekId: number | null;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  calendarEventId: string | null;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Week, (week) => week.tasks)
  week: Week;

  @ManyToMany(() => Category, (category) => category.tasks, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'TaskCategory' })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
