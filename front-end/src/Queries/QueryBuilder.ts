import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

export default function BuildQuery<
  TData = any,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<AxiosResponse<TData, any>>,
  options?: Omit<
    UseQueryOptions<Promise<TData>, AxiosError, TData, TQueryKey>,
    'initialData, queryKey, queryFn'
  >,
) {
  return <
    Omit<
      UseQueryOptions<Promise<TData>, AxiosError, TData, TQueryKey>,
      'initialData'
    >
  >{
    queryKey,
    queryFn: async () => (await queryFn()).data,
    ...options,
  };
}
