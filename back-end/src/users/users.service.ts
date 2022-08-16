import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth42userDto } from 'src/auth/dto/auth.42user.dto';
import { GameService } from 'src/game/game.service';
import { GameRepository } from 'src/game/game.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
  ) {}

  async createUser(user: Auth42userDto): Promise<void> {
    return this.userRepository.createUser(user);
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.userRepository.findByNickname(nickname);
  }

  async findByUser(user: User): Promise<User> {
    this.gameService.getGamesByUserId(user);
    return this.userRepository.findByUser(user);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async searchUsers(search: string): Promise<User[]> {
    return this.userRepository.searchUsers(search);
  }

  async updateUser(
    user: User,
    nickName?: string,
    profileImg?: string,
  ): Promise<User> {
    return this.userRepository.updateUser(user, nickName, profileImg);
  }
}
