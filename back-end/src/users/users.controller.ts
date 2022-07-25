import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './dto/userdto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signin')
  signIn(@Body() user: UserDto): Promise<void> {
    const { nickname } = user;
    return this.usersService.signIn(nickname);
  }
}
