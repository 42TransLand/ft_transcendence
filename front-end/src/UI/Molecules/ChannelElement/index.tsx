import React from 'react';
import { Text, HStack, Icon, Square } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { IoIosChatbubbles } from 'react-icons/io';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ChannelType from '../../../Props/ChannelType';

const FullSquare = styled(Square)`
  min-height: 100%;
  aspect-ratio: 1;
`;

function ChannelElement(props: {
  roomType: ChannelType.PUBLIC | ChannelType.PROTECT;
  channelName: string;
  currentHeadCount: number;
  chatRoomId: string;
}) {
  const { roomType, channelName, currentHeadCount, chatRoomId } = props;
  const navigate = useNavigate();

  return (
    <HStack
      borderWidth="1px"
      borderRadius="md"
      h="4em"
      w="full"
      justifyContent="space-between"
      onClick={
        roomType === ChannelType.PUBLIC
          ? () => navigate(`/chat/${chatRoomId}`)
          : undefined
      }
      cursor="pointer"
    >
      <HStack h="full">
        <FullSquare centerContent minHeight="100%">
          <Icon
            as={roomType === ChannelType.PROTECT ? LockIcon : IoIosChatbubbles}
            boxSize="1.75em"
          />
        </FullSquare>
        <Text fontSize="xl" marginX="0!important" noOfLines={1}>
          {channelName.length > 14
            ? channelName.substring(0, 14).concat('...')
            : channelName}
        </Text>
      </HStack>
      <Text fontSize="xl" textAlign="center" paddingX="0.5em">
        {`${currentHeadCount}명`}
      </Text>
    </HStack>
  );
}

export default ChannelElement;
