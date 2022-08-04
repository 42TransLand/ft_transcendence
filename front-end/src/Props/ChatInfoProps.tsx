export default interface ChatInfoProps {
  roomType: 'private' | 'protected' | 'public';
  channelId: number;
  channelName: string;
  maxHeadCount: number;
}
