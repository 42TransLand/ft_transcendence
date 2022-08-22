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
import ChangePasswordChannel from '../../Templates/ChangePasswordChannel';
import PopoverButton from '../PopoverButton';
import ChannelType from '../../../Props/ChannelType';

export default function ChatHeader() {
  const [chat] = useChat();
  const iconType = React.useMemo(() => {
    if (chat.chatInfo.roomType === ChannelType.PUBLIC)
      return <Icon as={IoIosChatbubbles} boxSize="3em" />;
    if (chat.chatInfo.roomType === ChannelType.PROTECT)
      return <Icon as={LockIcon} boxSize="3em" />;
    return <Icon as={FiSend} boxSize="3em" />;
  }, [chat.chatInfo.roomType]);

  return (
    <HStack justifyContent="space-between">
      <HStack justifyContent="flex-start">
        <Square centerContent>
          {chat.chatInfo.roomType !== 'PRIVATE' ? (
            <PopoverButton
              icon={iconType}
              placement="bottom-end"
              transparent
              w="420px"
              h="170px"
            >
              <ChangePasswordChannel />
            </PopoverButton>
          ) : (
            iconType
          )}
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
