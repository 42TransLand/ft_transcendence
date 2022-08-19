import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersService } from 'src/users/users.service';
import { Auth42userDto } from './dto/auth.42user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getUserMe(accessToken: string): Promise<Auth42userDto> {
    let user: Auth42userDto;
    await axios({
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        user = {
          id: res.data.id,
          username: res.data.login,
          email: res.data.email,
          avatar: res.data.image_url,
        };
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
    return user;
  }

  async generateAccessToken(
    id: string,
    isTfaAuthenticated = false,
  ): Promise<string> {
    const accessToken = await this.jwtService.sign({
      id,
      isTfaAuthenticated,
    });
    return `Authentication=${accessToken}; Path=/; Max-Age=36000`;
  }
}
