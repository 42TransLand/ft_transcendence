import axios from 'axios';
import NotificationProps from '../../Props/NotificationProps';
import BuildQuery from '../QueryBuilder';

const ALERT_GET = BuildQuery<NotificationProps[]>(
  ['alerts'],
  () => axios.get('/alert'),
  { refetchInterval: 1000 },
);

export default ALERT_GET;
