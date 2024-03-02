import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';

import { UserService } from './user.service';
import { User, UserRole, UserRequest } from './entities/user.entity';
import { Week } from '../week/entities/week.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../app.controller';
import { Roles } from '../common/decorators/roles.decorator';
import { UserIsOwnerGuard } from '../common/guards/user-is-owner.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<object> {
    return await this.userService.createUser(createUserDto);
  }

  @Get('all')
  @Roles([UserRole.ADMIN])
  public async getUsers(@Req() request: UserRequest): Promise<User[]> {
    const user = await this.userService.getUserForRequest(request);

    if (!user) throw new UnauthorizedException();

    return await this.userService.getUsers();
  }

  @Get('me')
  public async getUserData(@Req() request: UserRequest): Promise<User | null> {
    const user = await this.userService.getUserForRequest(request);

    return await this.userService.getUserData(user.id);
  }

  @Get('currentWeek')
  public async getUserCurrentWeek(@Req() request: UserRequest): Promise<Week | object> {
    const user = await this.userService.getUserForRequest(request);

    if (!user) throw new UnauthorizedException();

    return await this.userService.getUserCurrentWeek(user.id);
  }

  @Get('backlog')
  public async getUserBacklog(@Req() request: UserRequest): Promise<object> {
    const user = await this.userService.getUserForRequest(request);

    if (!user) throw new UnauthorizedException();

    return await this.userService.getUserBacklog(user.id);
  }

  @Get('stats')
  public async getUserStats(@Req() request: UserRequest): Promise<object> {
    const user = await this.userService.getUserForRequest(request);

    return await this.userService.getUserStats(user.id);
  }

  @UseGuards(UserIsOwnerGuard)
  @Get('/:userId')
  public async getUser(@Param('userId') userId: number) {
    return await this.userService.getUserById(userId);
  }

  @UseGuards(UserIsOwnerGuard)
  @Patch('/')
  public async editUser(@Req() request: UserRequest, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.getUserForRequest(request);

    return await this.userService.editUser(user.id, updateUserDto);
  }

  @UseGuards(UserIsOwnerGuard)
  @Delete('/delete/:userId')
  public async deleteUser(@Req() request: UserRequest, @Param('userId') userId: number): Promise<string> {
    const user = await this.userService.getUserForRequest(request);

    if (!user) throw new UnauthorizedException();

    return await this.userService.deleteUser(userId);
  }
}
