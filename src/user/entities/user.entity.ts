import { PrimaryGeneratedColumn, BaseEntity, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
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

  @Column({ default: null })
  locale: string;

  @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column('enum', { enum: UserRole, default: UserRole.USER })
  role: UserStatus;

  @Column('enum', { enum: UserSex, default: null })
  sex: UserSex;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
