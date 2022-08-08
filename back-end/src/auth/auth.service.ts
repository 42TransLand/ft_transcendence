import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from 'src/users/users.service';
import { Auth42userDto } from './dto/auth.42user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

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
        console.log('good');
        user = {
          id: res.data.id,
          username: res.data.login,
          email: res.data.email,
          avatar: res.data.image_url,
        };
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
    return user;
  }
}
