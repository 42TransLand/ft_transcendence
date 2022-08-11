import axios from 'axios';
import UserProfileProps from '../../Props/UserProfileProps';
import BuildQuery from '../QueryBuilder';

const USERS_PROFILE_GET = (nickname: string) =>
  BuildQuery<UserProfileProps>(['profile', nickname], () =>
    axios.get(`/users/profile/${nickname}`),
  );

export default USERS_PROFILE_GET;
