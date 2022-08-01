import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signIn(nickname: string): Promise<void> {
    // const user = .create({nickname});
    return this.userRepository.signIn(nickname);
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.userRepository.findByNickname(nickname);
  }

  async verifyUser(user: User): Promise<User> {
    return this.userRepository.verifyUser(user);
  }
}
