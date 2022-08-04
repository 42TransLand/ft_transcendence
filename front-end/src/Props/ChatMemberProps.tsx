export default interface ChatMemberProps {
  profileIcon: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  muted: boolean;
  blocked: boolean;
}
