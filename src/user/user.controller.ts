import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
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
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.userService.createUser(createUserDto);
  }

  @Get('all')
  @Roles([UserRole.ADMIN])
  public async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @UseGuards(UserIsOwnerGuard)
  @Get('/:userId')
  public async getUser(@Param('userId') userId: number) {
    return await this.userService.getUserById(userId);
  }

  @UseGuards(UserIsOwnerGuard)
  @Patch('/edit/:userId')
  public async editUser(@Body() updateUserDto: UpdateUserDto, @Param('userId') userId: number): Promise<string> {
    return await this.userService.editUser(userId, updateUserDto);
  }

  @UseGuards(UserIsOwnerGuard)
  @Delete('/delete/:userId')
  public async deleteUser(@Param('userId') userId: number): Promise<string> {
    return await this.userService.deleteUser(userId);
  }
}
