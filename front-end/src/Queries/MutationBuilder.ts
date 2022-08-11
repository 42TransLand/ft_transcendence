import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

export default function BuildMutation<TData = any, TVariables = void>(
  mutationFn: (value: TVariables) => Promise<AxiosResponse<TData, any>>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<any, any>, TVariables>,
    'mutationFn'
  >,
) {
  return <UseMutationOptions<TData, AxiosError<any, any>, TVariables>>{
    mutationFn: async (value) => (await mutationFn(value)).data,
    ...options,
  };
}
