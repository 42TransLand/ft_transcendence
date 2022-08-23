import axios from 'axios';
import ChatUserProps from '../../Props/ChatUserProps';
import BuildQuery from '../QueryBuilder';

const CHAT_USERS_GET = (chatRoomId: string, onlyOnce?: boolean) =>
  BuildQuery<ChatUserProps[]>(
    ['chatUsers'],
    () => axios.get(`/chat/users/${chatRoomId}`),
    onlyOnce
      ? {
          staleTime: Infinity,
        }
      : undefined,
  );

export default CHAT_USERS_GET;
