import axios from 'axios';
import FriendInfoProps from '../../Props/FriendInfoProps';
import BuildQuery from '../QueryBuilder';

const FRIEND_GET = BuildQuery<FriendInfoProps[]>(['friend'], () =>
  axios.get('/friend'),
);

export default FRIEND_GET;
