import React from 'react';
import { useQuery } from '@tanstack/react-query';
import BLOCK_GET from '../Queries/Blocks/All';

export default function useBlocks() {
  const { data, isLoading, error } = useQuery(BLOCK_GET);
  const blocks = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return data;
  }, [data, isLoading, error]);
  return blocks;
}
