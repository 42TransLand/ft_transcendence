import React from 'react';
import { Text, HStack, Icon, Square } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { IoIosChatbubbles } from 'react-icons/io';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import useWarningDialog from '../../../Hooks/useWarningDialog';

const FullSquare = styled(Square)`
  min-height: 100%;
  aspect-ratio: 1;
`;

function ChannelElement(props: {
  roomType: 'PUBLIC' | 'PROTECT';
  channelName: string;
  currentHeadCount: number;
  chatRoomId: string;
}) {
  const { roomType, channelName, currentHeadCount, chatRoomId } = props;
  const { WarningDialogComponent, setError } = useWarningDialog();
  const navigate = useNavigate();
  const queyrClient = useQueryClient();

  const onClickHandler = () => {
    if (roomType === 'PUBLIC') {
      axios
        .post(`/chat/join/${chatRoomId}`)
        .then(() => {
          queyrClient.invalidateQueries(['channels']);
          navigate(`/chat/${chatRoomId}`);
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '채팅방 입장 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '채팅방 입장 실패',
              bodyMessage: err.message,
            });
          }
        });
    }
  };

  return (
    <HStack
      borderWidth="1px"
      borderRadius="md"
      h="4em"
      w="full"
      justifyContent="space-between"
      onClick={onClickHandler}
    >
      <HStack h="full">
        <FullSquare centerContent minHeight="100%">
          <Icon
            as={roomType === 'PROTECT' ? LockIcon : IoIosChatbubbles}
            boxSize="1.75em"
          />
        </FullSquare>
        <Text fontSize="xl" marginX="0!important" noOfLines={1}>
          {channelName}
        </Text>
      </HStack>
      <Text fontSize="xl" textAlign="center" paddingX="0.5em">
        {`${currentHeadCount}명`}
      </Text>
      {WarningDialogComponent}
    </HStack>
  );
}

export default ChannelElement;
