import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne
} from 'typeorm';

import { Task } from '../../task/entities/task.entity';
import { Category } from '../../category/entities/category.entity';
import { Preferences } from '../../preferences/entities/preferences.entity';

export interface UserRequest extends Request {
  user: { userId: number };
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum DateFormat {
  'DD.MM.YYYY' = 'DD.MM.YYYY',
  'MM/DD/YYYY' = 'MM/DD/YYYY',
  'MMM DD, YYYY' = 'MMM DD, YYYY'
}

export type UserRoleType = UserRole.ADMIN | UserRole.USER;

export enum UserSex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

@Entity('User')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('enum', { enum: DateFormat, default: DateFormat['DD.MM.YYYY'] })
  dateFormat: DateFormat;

  @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column('enum', { enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column('enum', { enum: UserSex, default: null })
  sex: UserSex;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToOne(() => Preferences, (preferences) => preferences.user, { onDelete: 'CASCADE' })
  preferences: Preferences;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
