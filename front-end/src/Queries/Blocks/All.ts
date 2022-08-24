import axios from 'axios';
import BlocksProps from '../../Props/BlocksProps';
import BuildQuery from '../QueryBuilder';

const BLOCK_GET = BuildQuery<BlocksProps[]>(['blocks'], () =>
  axios.get('/friend/block'),
);

export default BLOCK_GET;
