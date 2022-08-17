import ChatMemberRole from './ChatMemberRole';

export default interface ChatMemberProps {
  profileImg: string;
  userId: string;
  name: string;
  role: ChatMemberRole;
  muted: boolean;
  blocked: boolean;
}
