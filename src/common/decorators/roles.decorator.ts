import { Reflector } from '@nestjs/core';
import { UserRoleType } from '../../user/entities/user.entity';

export const Roles = Reflector.createDecorator<[UserRoleType]>();
