import React from 'react';
import {
  HStack,
  Icon,
  ModalCloseButton,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useChat } from '../../../Hooks/useChat';

export default function ChatHeader() {
  const [chat] = useChat();

  return (
    <HStack justifyContent="space-between">
      <HStack justifyContent="flex-start">
        <Square centerContent>
          <Icon
            as={chat.chatInfo.isProtected ? LockIcon : UnlockIcon}
            boxSize="2em"
          />
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
