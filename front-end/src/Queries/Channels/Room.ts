import axios from 'axios';
import ChannelProps from '../../Props/ChannelProps';
import BuildQuery from '../QueryBuilder';

const ROOM_GET = (roomId: string) =>
  BuildQuery<ChannelProps>(['channel'], () => axios.get(`/chat/${roomId}`));

export default ROOM_GET;
