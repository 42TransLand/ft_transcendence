import ChannelType from './ChannelType';

export default interface ChannelProps {
  id: string;
  name: string;
  type: ChannelType.PUBLIC | ChannelType.PROTECT;
  password: string;
  count: number;
}
