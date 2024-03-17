import { compare } from 'bcrypt';
import { Request } from 'express';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Req,
  UnauthorizedException
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserStatus, UserRequest } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    this.logger.log(`Found user with ID: ${user?.id} for email ${email}`);

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

    this.logger.log(`User ${userData?.id} successfully logged in`);

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
