import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FriendListDto } from './dto/friend.list.dto';

@ApiTags('Friend')
@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
  constructor(private friendService: FriendService) {}

  @ApiOperation({ summary: '친구 전체 조회' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @Get()
  findAllFriends(@GetUser() user: User): Promise<FriendListDto[]> {
    return this.friendService.findAllFriends(user);
  }

  @ApiOperation({ summary: '친구 요청' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @ApiResponse({ status: 409, description: '이미 친구인 유저에게 요청했을 때' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Put('request/:nickname')
  requestFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.friendService.requestFriend(user, nickname);
  }

  @ApiOperation({ summary: '친구 수락' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('accept/:alertId/:userId')
  acceptFriend(
    @Param('alertId') alertId: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.friendService.acceptFriend(user, alertId, userId);
  }

  // 201: success , 404: error
  @ApiOperation({ summary: '친구 거절' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Delete('reject/:alertId/:userId')
  rejectFriend(
    @Param('alertId') alertId: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.friendService.rejectFriend(user, alertId, userId);
  }

  @ApiOperation({ summary: '친구 차단' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('block/:nickname')
  blockFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.friendService.blockFriend(user, nickname);
  }

  @ApiOperation({ summary: '친구 차단 해제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청이 잘못됐을 때' })
  @ApiResponse({ status: 404, description: '없는 유저를 요청했을 때' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @Patch('unblock/:nickname')
  unblockFriend(
    @Param('nickname') nickname: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.friendService.unblockFriend(user, nickname);
  }
}
