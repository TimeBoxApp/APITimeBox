import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class UserIsOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Allow access if the user is an admin or is the owner of the account
    return user.role === UserRole.ADMIN || user.userId.toString() === request.params.userId;
  }
}
