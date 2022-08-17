import { UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import BuildMutation from '../MutationBuilder';

const FRIEND_REJECT_DELETE = <TData = any>(
  alertId: string,
  senderId: string,
  options: Omit<UseMutationOptions<TData, AxiosError<any, any>>, 'mutationFn'>,
) =>
  BuildMutation<any>(
    () => axios.delete(`/friend/reject/${alertId}/${senderId}`),
    {
      ...options,
    },
  );

export default FRIEND_REJECT_DELETE;
