import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Auth42userDto } from 'src/auth/dto/auth.42user.dto';
import { Like, Repository } from 'typeorm';
import { CustomRepository } from '../custom/typeorm.decorator';
import { User, DEFAULT_PROFILE_IMG } from './entities/user.entity';
import * as fs from 'fs';
import { GameRecord } from 'src/game/entities/game.entity';
import { UserProfileDto } from './dto/user.profile.dto';
import { UserRecordDto } from './dto/user.record.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: Auth42userDto, randomName: string): Promise<void> {
    const newUser = this.create({
      id: user.id,
      nickname: randomName,
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

  async findByUser(user: User): Promise<User> {
    const userProfile: User = await this.findOneBy({ id: user.id });
    if (userProfile === null) {
      throw new NotFoundException(`User not found`);
    }
    return userProfile;
  }

  async findByNickname(nickname: string): Promise<User> {
    const user: User = await this.findOneBy({ nickname });
    if (user === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async checkNickname(nickname: string): Promise<boolean> {
    const user: User = await this.findOneBy({ nickname });
    if (user === null) {
      return false;
    }
    return true;
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
    score?: number,
  ): Promise<User> {
    if (nickName) {
      const matches = /^[a-z|A-Z|0-9|]+$/;
      if (!matches.test(nickName)) {
        throw new BadRequestException(`특수문자는 사용 할 수 없습니다.`);
      }
      user.nickname = nickName;
    }
    if (profileImg) {
      if (
        user.profileImg !== DEFAULT_PROFILE_IMG &&
        fs.existsSync(user.profileImg)
      ) {
        fs.unlink(user.profileImg, (err) => {
          if (err) {
            throw new NotFoundException();
          }
        });
      }
      user.profileImg = profileImg;
    }
    if (score) {
      if (user.rankScore <= score) {
        user.rankScore = 0;
      } else {
        user.rankScore += score;
      }
    }
    user.isFirstLogin = false;
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`이미 존재하는 닉네임입니다.`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async infoUser(
    user: User,
    gameRecord: GameRecord[],
  ): Promise<UserProfileDto> {
    let winCount = 0;
    let loseCount = 0;
    const arrRecord: UserRecordDto[] = [];
    gameRecord.forEach((param) => {
      if (param.winUser.id === user.id && param.isLadder) winCount += 1;
      else if (param.loseUser.id === user.id && param.isLadder) loseCount += 1;
      const record: UserRecordDto = {
        id: param.id,
        winUserId: param.winUser.id,
        winUserNickname: param.winUser.nickname,
        winUserProfileImg: param.winUser.profileImg,
        winUserScore: param.winUserScore,
        loseUserId: param.loseUser.id,
        loseUserNickname: param.loseUser.nickname,
        loseUserProfileImg: param.loseUser.profileImg,
        loseUserScore: param.loseUserScore,
        isLadder: param.isLadder,
        type: param.type,
        createAt: param.createAt,
        updateAt: param.updateAt,
      };
      arrRecord.push(record);
    });
    const result: UserProfileDto = {
      id: user.id,
      isFirstLogin: user.isFirstLogin,
      nickname: user.nickname,
      tfaEnabled: user.tfaEnabled,
      email: user.email,
      rankScore: user.rankScore,
      profileImg: user.profileImg,
      winCount,
      loseCount,
      totalCount: winCount + loseCount,
      gameRecord: arrRecord,
    };

    return result;
  }
}
