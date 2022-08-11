import UserInfoProps from './UserInfoProps';

export default interface NotificationProps {
  alertId: string;
  requestor: UserInfoProps;
  createdAt: Date;
}
