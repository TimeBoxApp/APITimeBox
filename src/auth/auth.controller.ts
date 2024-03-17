import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local.auth.guard';
import { Public } from '../app.controller';
import { UserRequest } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() request: UserRequest): Promise<object> {
    console.log(request);
    return this.authService.login(request);
  }
}
