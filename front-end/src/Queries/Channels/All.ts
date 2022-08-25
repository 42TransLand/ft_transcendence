import axios from 'axios';
import ChannelProps from '../../Props/ChannelProps';
import BuildQuery from '../QueryBuilder';

const CHANNEL_GET = BuildQuery<ChannelProps[]>(
  ['channels'],
  () => axios.get('/chat'),
  { refetchInterval: 1000 },
);

export default CHANNEL_GET;
