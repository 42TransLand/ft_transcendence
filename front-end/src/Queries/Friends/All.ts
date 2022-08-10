import axios from 'axios';
import UserInfoProps from '../../Props/UserInfoProps';
import BuildQuery from '../QueryBuilder';

enum FriendStatus {
  PENDDING = 'PENDDING',
  FRIEND = 'FRIEND',
  NONE = 'NONE',
}

interface FriendType {
  receiver: UserInfoProps;
  requestor: UserInfoProps;
  status: FriendStatus;
}

const FRIEND_GET = BuildQuery<FriendType[]>(['friends'], () =>
  axios.get('/friend'),
);

export default FRIEND_GET;
