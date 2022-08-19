import React from 'react';
import { Box, Center, Icon, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { MdError } from 'react-icons/md';

function Error({ message }: { message: string }) {
  return (
    <Center width="full" height="100vh" color="#fff">
      <SimpleGrid columns={1} rowGap={14}>
        <Center>
          <Image src="/logo.svg" alt="logo" />
        </Center>
        <Center>
          <Icon as={MdError} boxSize="4em" mr={0} />
          <Box marginX={4}>
            <Text fontSize="4xl">{message}</Text>
          </Box>
        </Center>
      </SimpleGrid>
    </Center>
  );
}

export default Error;
