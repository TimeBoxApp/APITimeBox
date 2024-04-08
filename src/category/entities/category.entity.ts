import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne
} from 'typeorm';

import { Task } from '../../task/entities/task.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  emoji: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  color: string | null;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Task, (task) => task.categories, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'TaskCategory' })
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
