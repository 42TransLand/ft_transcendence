import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendDto } from './dto/friend.dto';
import { FriendAlertDto } from './dto/friendAlert.dto';
import { FriendService } from './friend.service';
import { Friend } from './entities/friend.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Friend')
@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
  constructor(private friendService: FriendService) {}

  @ApiOperation({ summary: '친구 전체 조회' })
  @ApiResponse({ status: 204, description: 'success' })
  @Get()
  findAllFriends(@GetUser() user: User): Promise<Friend[]> {
    return this.friendService.findAllFriends(user);
  }

  @ApiOperation({ summary: '친구 검색' })
  @ApiResponse({ status: 204, description: 'success' })
  @Get('/search/:nickname')
  searchFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<Friend[]> {
    return this.friendService.searchFriend(user, nickname);
  }

  @ApiOperation({ summary: '친구 요청' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @Put('request/:nickname')
  requestFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<Friend> {
    return this.friendService.requestFriend(user, nickname);
  }

  @ApiOperation({ summary: '친구 수락' })
  @ApiResponse({ status: 204, description: 'success' })
  @Patch('accept/:nickname')
  acceptFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<Friend> {
    return this.friendService.acceptFriend(user, nickname);
  }

  // 201: success , 404: error
  @ApiResponse({ status: 204, description: 'success' })
  @ApiOperation({ summary: '친구 거절' })
  @Delete('reject/:nickname')
  rejectFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<DeleteResult> {
    return this.friendService.rejectFriend(user, nickname);
  }

  @ApiOperation({ summary: '친구 차단' })
  @ApiResponse({ status: 201, description: 'success' })
  @Post('block/:nickname')
  blockFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<Friend> {
    return this.friendService.blockFriend(user, nickname);
  }
}
