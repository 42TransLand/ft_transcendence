import axios from 'axios';
import UserInfoProps from '../../Props/UserInfoProps';
import BuildQuery from '../QueryBuilder';

interface AlertType {
  id: string;
  receiver: UserInfoProps;
  requestor: UserInfoProps;
  createAt: Date;
}

const ALERT_GET = BuildQuery<AlertType[]>(['alerts'], () =>
  axios.get('/alert'),
);

export default ALERT_GET;
