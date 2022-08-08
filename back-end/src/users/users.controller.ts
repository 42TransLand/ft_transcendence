import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/userdto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async test(@Res() res) {
    res.json({ id: 1, name: 'smun' });
  }
}
