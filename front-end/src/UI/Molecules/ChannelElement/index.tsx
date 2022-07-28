import React from 'react';
import { Text, HStack, Spacer } from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';

function ChannelElement(props: {
  isProtected: boolean;
  channelName: string;
  currentHeadCount: number;
  maxHeadCount: number;
}) {
  const { isProtected, channelName, currentHeadCount, maxHeadCount } = props;
  const icon = isProtected ? (
    <LockIcon boxSize="2em" />
  ) : (
    <UnlockIcon boxSize="2em" />
  );

  return (
    <HStack
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
      h="60px"
      w="100%"
    >
      {icon}
      <Spacer />
      <Text fontSize="lg">{channelName}</Text>
      <Spacer />
      <Text fontSize="lg">
        {currentHeadCount}/{maxHeadCount}
      </Text>
    </HStack>
  );
}

export default ChannelElement;
