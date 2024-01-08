import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { BadRequestException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserRequest, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<object> {
    const { password, email } = createUserDto;
    const isExistingUser = await this.userRepository.exists({ where: { email } });

    this.logger.error(`User with email ${email} already exists`);

    if (isExistingUser) throw new BadRequestException('User already exists');

    if (!this.validatePasswordStrength(password)) {
      this.logger.error(`Password for user ${email} does not conform to the rules`);

      throw new BadRequestException('Password does not conform to the rules');
    }

    createUserDto.password = await this.hashPassword(password);

    const result = await this.userRepository.save(createUserDto);

    this.logger.log(`Successfully created user ${result.id} with email ${email}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: `Successfully created user ${result.id} with email ${email}`
    };
  }

  public async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        sex: true
      }
    });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        status: true,
        role: true
      }
    });
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        role: true
      }
    });
  }

  public async getUserData(request: UserRequest): Promise<User | null> {
    const { user } = request;

    if (!user) throw BadRequestException;

    const { userId } = user;

    return await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
  }

  public async getUserRole(id: number | null): Promise<UserRole | null> {
    if (!id) return null;

    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        role: true
      }
    });

    if (!user || !user.role) return null;

    return user.role;
  }

  public async editUser(userId: number, updateUserDto: UpdateUserDto): Promise<string> {
    const editedUser: User | null = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!editedUser) throw new NotFoundException('User not found');

    await this.userRepository.update({ id: userId }, updateUserDto);

    this.logger.log(`Successfully updated user ${userId}`);

    return 'OK';
  }

  public async deleteUser(userId: number): Promise<string> {
    await this.userRepository.delete(userId);

    this.logger.log(`Successfully deleted user ${userId}`);

    return 'OK';
  }

  private validatePasswordStrength(password: string): boolean {
    // At least one uppercase letter, one lowercase letter, one number and one special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordRegex.test(password) && password.length > 7;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;

    return await hash(password, saltOrRounds);
  }
}
