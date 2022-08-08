import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth42userDto } from 'src/auth/dto/auth.42user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(user: Auth42userDto): Promise<void> {
    return this.userRepository.createUser(user);
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.userRepository.findByNickname(nickname);
  }

  async verifyUser(user: User): Promise<User> {
    return this.userRepository.verifyUser(user);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }
}
