import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { UserRole } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserIsOwnerGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (user) {
      const { userId } = user;
      const userRole = await this.userService.getUserRole(userId);

      // Allow access if the user is an admin or is the owner of the account
      if (userRole !== UserRole.ADMIN && user.userId.toString() !== request.params.userId)
        throw new ForbiddenException('You lack privileges to access this endpoint');

      return true;
    }

    return false;
  }
}
