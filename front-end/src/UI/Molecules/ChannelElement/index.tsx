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
  const icon = isProtected ? <LockIcon /> : <UnlockIcon />;

  return (
    <HStack
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
      h="30px"
      w="200px"
    >
      {icon}
      <Spacer />
      <Text fontSize="xs">{channelName}</Text>
      <Spacer />
      <Text fontSize="xs">
        {currentHeadCount}/{maxHeadCount}
      </Text>
    </HStack>
  );
}

export default ChannelElement;
