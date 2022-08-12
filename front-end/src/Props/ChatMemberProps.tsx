export default interface ChatMemberProps {
  profileImg: string;
  userId: number;
  name: string;
  role: 'owner' | 'admin' | 'member';
  muted: boolean;
  blocked: boolean;
}
