import axios from 'axios';
import UserInfoProps from '../../Props/UserInfoProps';

const USERS_ME_GET = {
  queryKey: ['me'],
  queryFn: async (): Promise<UserInfoProps> => axios.get('/users/me'),
};

export default USERS_ME_GET;
