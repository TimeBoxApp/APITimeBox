import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles || !roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!this.matchRoles(roles, user.role)) {
      throw new ForbiddenException('You lack privileges to access this endpoint');
    }

    return true;
  }

  private matchRoles(routeRoles: string[], userRole: string): boolean {
    return routeRoles.includes(userRole);
  }
}
