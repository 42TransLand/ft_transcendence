import ChatUserUpdate from '../constants/chat.user.update.enum';

export default interface ChatUpdateUserNotifyProps {
  nickname: string;

  type: ChatUserUpdate;

  status: boolean;
}
