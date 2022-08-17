import UserState from '../constants/user.state.enum';

export default interface StateUpdateUserNotify {
  id: string;
  state: UserState;
}
