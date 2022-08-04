import React from 'react';
import { Text, HStack, Icon, Square } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { IoIosChatbubbles } from 'react-icons/io';
import styled from 'styled-components';

const FullSquare = styled(Square)`
  min-height: 100%;
  aspect-ratio: 1;
`;

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
      w="full"
      justifyContent="space-between"
    >
      <HStack h="full">
        <FullSquare centerContent minHeight="100%">
          <Icon
            as={isProtected ? LockIcon : IoIosChatbubbles}
            boxSize="1.75em"
          />
        </FullSquare>
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
