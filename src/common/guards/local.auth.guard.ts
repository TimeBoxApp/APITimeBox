import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context);
    const result: boolean = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    console.log(request);

    await super.logIn(request);

    console.log(result);

    return result;
  }
}
