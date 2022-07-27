import React from 'react';
import { Center, Spinner, Text } from '@chakra-ui/react';

function Loading({ message }: { message: string }) {
  return (
    <Center>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text fontSize="4xl">{message}</Text>
    </Center>
  );
}

export default Loading;
