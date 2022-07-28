import React from 'react';
import { VStack } from '@chakra-ui/react';

function ElementList(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <VStack width="100%" maxH="100%" overflow="auto">
      {children}
    </VStack>
  );
}

export default ElementList;
