import { NotFoundException } from '@nestjs/common';
import { Auth42userDto } from 'src/auth/dto/auth.42user.dto';
import { Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: Auth42userDto): Promise<void> {
    const newUser = this.create({ id: user.id, nickname: user.username });
    await this.save(newUser);
  }

  async findByNickname(nickname: string): Promise<User> {
    const user: User = await this.findOneBy({ nickname });
    return user;
  }

  async verifyUser(user: User): Promise<User> {
    const findUser: User = await this.findOneBy({ id: user.id });
    if (findUser === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.findOneBy({ id });
    return user;
  }
}
