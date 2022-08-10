import axios from 'axios';
import UserInfoProps from '../../Props/UserInfoProps';
import BuildQuery from '../QueryBuilder';

const USERS_ME_GET = BuildQuery<UserInfoProps>(['me'], () =>
  axios.get('/users/me'),
);

export default USERS_ME_GET;
