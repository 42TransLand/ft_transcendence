import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async signIn(nickname: string): Promise<void> {
    const user = this.create({ nickname });
    await this.save(user);
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
}
