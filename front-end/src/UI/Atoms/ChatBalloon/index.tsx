import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function ChatBalloon({
  self,
  children,
}: {
  self: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box
      borderRadius="xl"
      bg={self ? '#278EFF' : '#2FCC59'}
      color="white"
      px={2}
      py={1}
    >
      <Text textColor="white" fontSize="md">
        {children}
      </Text>
    </Box>
  );
}
