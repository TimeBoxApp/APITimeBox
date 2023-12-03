import { compare } from 'bcrypt';
import { Request } from 'express';
import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserStatus } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (user.status !== UserStatus.ACTIVE) throw new BadRequestException(`User ${email} is deactivated`);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException(`User ${email} password is incorrect`);
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role
    };
  }

  async login(): Promise<string> {
    return 'Login successful';
  }

  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return 'Logout successful';
    });
  }
}
