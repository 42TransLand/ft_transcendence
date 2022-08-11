export default interface ChannelProps {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PROTECT';
  password: string;
}
