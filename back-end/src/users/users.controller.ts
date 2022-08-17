import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/userdto';
import { User } from './entities/user.entity';
import { GetUser } from './get.user.decorator';
import { UsersService } from './users.service';
import { loaclOptions } from './constants/multer.options';
import { UserProfileDto } from './dto/user.profile.dto';

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
  getMe(@GetUser() user: User): Promise<UserProfileDto> {
    return this.usersService.infoUser(user);
  }

  @ApiOperation({ summary: '유저 프로필 조회' })
  @ApiResponse({ status: 200, description: '유저 프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '쿠키 인증 실패' })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저' })
  @Get('/profile/:nickname')
  getProfile(
    @GetUser() user: User,
    @Param('nickname') nickname: string,
  ): Promise<UserProfileDto> {
    return this.usersService.infoUser(user, nickname);
  }

  @ApiOperation({ summary: '유저 검색 에러 처리용' })
  @ApiResponse({ status: 200, description: '성공' })
  @Get('/search/')
  searchUsersError(): [] {
    return [];
  }

  @ApiOperation({ summary: '유저 검색' })
  @ApiResponse({ status: 200, description: '유저 검색 성공' })
  @ApiResponse({ status: 401, description: '쿠키 인증 실패' })
  @Get('/search/:nickname')
  searchUsers(@Param('nickname') nickname: string): Promise<User[]> {
    return this.usersService.searchUsers(nickname);
  }

  @ApiOperation({ summary: '나의 정보 수정' })
  @ApiResponse({ status: 200, description: '유저 정보 수정' })
  @ApiResponse({ status: 400, description: '지원하지 않는 이미지 형식' })
  @ApiResponse({ status: 401, description: '쿠키 인증 실패' })
  @ApiResponse({ status: 409, description: '중복된 닉네임' })
  @Patch('/me')
  @UseInterceptors(FileInterceptor('file', loaclOptions))
  updateUser(
    @GetUser() user: User,
    @Body() { nickname }: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUser(user, nickname, file?.path);
  }
}
