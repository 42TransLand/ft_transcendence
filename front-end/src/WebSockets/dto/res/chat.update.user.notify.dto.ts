import ChatUserUpdate from '../constants/chat.user.update.enum';

export default interface ChatUpdateUserNotifyProps {
  id: string;
  nickname: string;
  type: ChatUserUpdate;
  status: boolean;
}
