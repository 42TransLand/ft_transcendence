export default interface ChatMemberProps {
  profileIcon: string;
  userId: number;
  name: string;
  role: 'owner' | 'admin' | 'member';
  muted: boolean;
  blocked: boolean;
}
