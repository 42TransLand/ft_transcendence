import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/userdto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 등록' })
  @ApiResponse({ status: 201, description: 'success' })
  @Post('/signin')
  signIn(@Body() user: UserDto): Promise<void> {
    const { nickname } = user;
    return this.usersService.signIn(nickname);
  }
}
