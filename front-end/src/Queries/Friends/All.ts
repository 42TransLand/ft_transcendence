import axios from 'axios';
import UserInfoProps from '../../Props/UserInfoProps';
import BuildQuery from '../QueryBuilder';

const FRIEND_GET = BuildQuery<UserInfoProps[]>(['friend'], () =>
  axios.get('/friend'),
);

export default FRIEND_GET;
