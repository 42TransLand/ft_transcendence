import UserInfoProps from './UserInfoProps';

export default interface ChatUserProps {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'PARTICIPANT';
  unmutedAt: string | null;
  user: UserInfoProps;
}
