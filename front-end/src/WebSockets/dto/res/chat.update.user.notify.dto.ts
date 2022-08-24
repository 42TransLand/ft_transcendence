import ChatUserUpdate from '../constants/chat.user.update.enum';

export default interface ChatUpdateUserNotifyProps {
  id: string; // userId

  nickname: string;

  type: ChatUserUpdate;

  status: boolean;
}
