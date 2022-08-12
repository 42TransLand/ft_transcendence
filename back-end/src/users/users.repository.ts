import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Auth42userDto } from 'src/auth/dto/auth.42user.dto';
import { Like, Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: Auth42userDto): Promise<void> {
    const newUser = this.create({
      id: user.id,
      nickname: user.username,
      email: user.email,
    });
    try {
      await this.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`User already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByNickname(nickname: string): Promise<User> {
    const user: User = await this.findOneBy({ nickname });
    if (user === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async findByUser(user: User): Promise<User> {
    // const findUser: User = await this.findOneBy({ id: user.id });

    const findUser: User = await this.findOne({
      where: { id: user.id },
      relations: ['records.winUser', 'records.loseUser'],
    });
    if (findUser === null) {
      throw new NotFoundException(`User not found`);
    }
    // console.log(findUser);
    // findUser.records.forEach((record) => {
    //   console.log(
    //     `winUser: ${record.winUser.id} loseUser: ${record.loseUser.id}`,
    //   );
    // });
    return findUser;
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.findOneBy({ id });
    if (user === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users: User[] = await this.find();
    return users;
  }

  async searchUsers(search: string): Promise<User[]> {
    const users: User[] = await this.find({
      where: {
        nickname: Like(`%${search}%`),
      },
    });
    return users;
  }

  async updateUser(
    user: User,
    nickName?: string,
    profileImg?: string,
  ): Promise<User> {
    if (nickName) {
      user.nickname = nickName;
    }
    if (profileImg) {
      user.profileImg = profileImg;
    }
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`nickname already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
