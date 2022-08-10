import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/userdto';
import { User } from './entities/user.entity';
import { GetUser } from './get.user.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //
  @ApiOperation({ summary: '모든 유저 조회' })
  @Get('/all')
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: '본인 정보 조회' })
  @ApiResponse({ status: 200, description: '본인 정보 조회 성공' })
  @ApiResponse({ status: 401, description: '쿠키 인증 실패' })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  @Get('/me')
  getMe(@GetUser() user: User): Promise<User> {
    return this.usersService.findByUser(user);
  }

  @ApiOperation({ summary: '유저 프로필 조회' })
  @ApiResponse({ status: 200, description: '유저 프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '쿠키 인증 실패' })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  @Get('/profile/:nickname')
  getProfile(@Param('nickname') nickname: string): Promise<User> {
    return this.usersService.findByNickname(nickname);
  }

  //@ApiOperation({ summary: '내 정보 수정' })
  //@ApiResponse({ status: 200, description: '내 정보 수정 성공' })
  //@Patch('/me')
  //updateMe(@GetUser() user: User, @Body() userToUpdate: UserDto) {}
}
