import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FriendDto } from './dto/friend.dto';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  // [Todo] GetUser를 이용해서 요청을 보내는 자신의 아이디(RequestID)를 확인하는거 필요
  @Post('request')
  requestFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.requestFriend(friendDto);
  }

  @Post('accept')
  acceptFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.acceptFriend(friendDto);
  }

  // 201: success , 404: error
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 404, description: '실패' })
  @Delete('reject')
  rejectFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.rejectFriend(friendDto);
  }

  @Post('block')
  blockFriend(@Body() friendDto: FriendDto): Promise<void> {
    return this.friendService.blockFriend(friendDto);
  }
}
