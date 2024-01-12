import { compare } from 'bcrypt';
import { Request } from 'express';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserStatus, UserRequest } from '../user/entities/user.entity';

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
      userId: user.id
    };
  }

  async login(request: UserRequest): Promise<object> {
    const { user } = request;

    if (!user) throw new UnauthorizedException();

    const userData = await this.userService.getUserData(user.userId);

    return {
      statusCode: HttpStatus.OK,
      userData
    };
  }

  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {});

    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful'
    };
  }
}
