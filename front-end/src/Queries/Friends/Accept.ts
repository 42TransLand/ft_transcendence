import { UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import BuildMutation from '../MutationBuilder';

const FRIEND_ACCEPT_PATCH = <TData = any>(
  alertId: string,
  senderId: number,
  options: Omit<UseMutationOptions<TData, AxiosError<any, any>>, 'mutationFn'>,
) =>
  BuildMutation<any>(
    () => axios.patch(`/friend/accept/${alertId}/${senderId}`),
    {
      ...options,
    },
  );

export default FRIEND_ACCEPT_PATCH;
