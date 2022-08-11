import React from 'react';
import { useQuery } from '@tanstack/react-query';
import FRIEND_GET from '../Queries/Friends/All';

export default function useFriends() {
  const { data, isLoading, error } = useQuery(FRIEND_GET);
  const friends = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return data;
  }, [data, isLoading, error]);
  return friends;
}
