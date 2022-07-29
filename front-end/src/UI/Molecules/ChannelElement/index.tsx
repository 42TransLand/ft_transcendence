import React from 'react';
import { Text, HStack, Icon } from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import Square from '../../Atoms/Square';

function ChannelElement(props: {
  isProtected: boolean;
  channelName: string;
  currentHeadCount: number;
  maxHeadCount: number;
}) {
  const { isProtected, channelName, currentHeadCount, maxHeadCount } = props;

  return (
    <HStack
      borderWidth="1px"
      borderRadius="md"
      h="4em"
      w="100%"
      justifyContent="space-between"
    >
      <HStack h="full">
        <Square>
          <Icon as={isProtected ? LockIcon : UnlockIcon} boxSize="1.75em" />
        </Square>
        <Text fontSize="xl" marginX="0!important" noOfLines={1}>
          {channelName}
        </Text>
      </HStack>
      <Text fontSize="xl" paddingX="0.5em">
        {currentHeadCount}/{maxHeadCount}
      </Text>
    </HStack>
  );
}

export default ChannelElement;
