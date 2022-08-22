import ChatMemberRole from './ChatMemberRole';
import UserInfoProps from './UserInfoProps';

export default interface ChatUserProps {
  id: string;
  role: ChatMemberRole;
  unmutedAt: string | null;
  user: UserInfoProps;
}
