import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '../decorators/roles.decorator';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!roles || !roles?.length) {
      return true;
    }

    const { user } = request;

    if (user) {
      const { userId } = user;
      const userRole = await this.userService.getUserRole(userId);

      if (!this.matchRoles(roles, userRole))
        throw new ForbiddenException('You lack privileges to access this endpoint');
    }

    return true;
  }

  private matchRoles(routeRoles: string[], userRole: string | null): boolean {
    if (!userRole) return false;

    return routeRoles.includes(userRole);
  }
}
