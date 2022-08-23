import { UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import BuildMutation from '../MutationBuilder';

const CHANNEL_JOIN = <TData = any>(
  roomId: string,
  options: Omit<UseMutationOptions<TData, AxiosError<any, any>>, 'mutationFn'>,
  password?: any,
) =>
  BuildMutation<any>(() => axios.post(`/chat/join/${roomId}`, password), {
    ...options,
  });

export default CHANNEL_JOIN;
