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
import PopoverButton from '../PopoverButton';
import ChangePasswordChannel from '../../Molecules/ChangePasswordChannel';

export default function ChatHeader() {
  const [chat] = useChat();
  const iconType = React.useMemo(() => {
    if (chat.chatInfo.roomType === 'public')
      return <Icon as={IoIosChatbubbles} boxSize="3em" />;
    if (chat.chatInfo.roomType === 'protected')
      return <Icon as={LockIcon} boxSize="3em" />;
    return <Icon as={FiSend} boxSize="3em" />;
  }, [chat]);

  return (
    <HStack justifyContent="space-between">
      <HStack justifyContent="flex-start">
        <Square centerContent>
          <PopoverButton
            icon={iconType}
            placement="bottom-end"
            transparent
            w="420px"
            h="170px"
          >
            <ChangePasswordChannel />
          </PopoverButton>
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
