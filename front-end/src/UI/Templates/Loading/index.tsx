import React from 'react';
import {
  Box,
  Center,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';

function Loading({ message }: { message: string }) {
  return (
    <Center width="full" height="100vh" color="#fff">
      <SimpleGrid columns={1} rowGap={14}>
        <Center>
          <Image src="/logo.svg" alt="logo" />
        </Center>
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Box marginX={4}>
            <Text fontSize="4xl">{message}</Text>
          </Box>
        </Center>
      </SimpleGrid>
    </Center>
  );
}

export default Loading;
