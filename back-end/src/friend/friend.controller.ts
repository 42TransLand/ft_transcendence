import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendDto } from './dto/friend.dto';
import { FriendAlertDto } from './dto/friendAlert.dto';
import { FriendService } from './friend.service';

@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  // [Todo] GetUser를 이용해서 요청을 보내는 자신의 아이디(RequestID)를 확인하는거 필요
  @ApiOperation({ summary: '친구 요청' })
  @ApiResponse({ status: 204, description: 'success' })
  @Post('request')
  requestFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.requestFriend(friendDto);
  }

  @ApiOperation({ summary: '친구 수락' })
  @ApiResponse({ status: 204, description: 'success' })
  @Post('accept')
  acceptFriend(@Body() friendAlertDto: FriendAlertDto): Promise<void> {
    return this.friendService.acceptFriend(friendAlertDto);
  }

  // 201: success , 404: error
  @ApiResponse({ status: 204, description: 'success' })
  @ApiOperation({ summary: '친구 거절' })
  @Delete('reject')
  rejectFriend(@Body() friendAlertDto: FriendAlertDto): Promise<void> {
    return this.friendService.rejectFriend(friendAlertDto);
  }

  @ApiOperation({ summary: '친구 차단' })
  @ApiResponse({ status: 204, description: 'success' })
  @Post('block')
  blockFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.blockFriend(friendDto);
  }
}
