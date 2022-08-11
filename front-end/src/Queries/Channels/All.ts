import axios from 'axios';
import ChannelProps from '../../Props/ChannelProps';
import BuildQuery from '../QueryBuilder';

const CHANNEL_GET = BuildQuery<ChannelProps[]>(['channels'], () =>
  axios.get('/chat'),
);

export default CHANNEL_GET;
