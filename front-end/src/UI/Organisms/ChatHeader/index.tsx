import React from 'react';
import {
  HStack,
  Icon,
  ModalCloseButton,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { IoIosChatbubbles } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { useChat } from '../../../Hooks/useChat';

export default function ChatHeader() {
  const [chat] = useChat();
  const iconType = React.useMemo(() => {
    if (chat.chatInfo.roomType === 'public') return IoIosChatbubbles;
    if (chat.chatInfo.roomType === 'protected') return LockIcon;
    return FiSend;
  }, [chat]);

  return (
    <HStack justifyContent="space-between">
      <HStack justifyContent="flex-start">
        <Square centerContent>
          <Icon as={iconType} boxSize="2em" />
        </Square>
        <VStack textAlign="left">
          <Text
            width="full"
            marginInlineStart="1rem"
            marginY="0!important"
            fontSize={{ base: 'xl', lg: '3xl' }}
            noOfLines={1}
          >
            {chat.chatInfo.channelName}
          </Text>
        </VStack>
      </HStack>
      <ModalCloseButton />
    </HStack>
  );
}
