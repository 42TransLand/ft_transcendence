import axios from 'axios';
import UserSearchResultProps from '../../Props/UserSearchResultProps';
import BuildQuery from '../QueryBuilder';

const USERS_SEARCH_GET = (nickname: string) =>
  BuildQuery<UserSearchResultProps[]>(['search', nickname], () =>
    axios.get(`/users/search/${nickname}`),
  );

export default USERS_SEARCH_GET;
