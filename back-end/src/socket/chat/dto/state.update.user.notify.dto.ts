import UserState from '../constants/state.user.enum';

export default interface StateUpdateUserNotifyDto {
  id: string;
  state: UserState;
}
