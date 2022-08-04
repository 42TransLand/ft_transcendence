import React from 'react';
import { Image, Box, HStack, VStack, Text } from '@chakra-ui/react';
import ChatElementProps from '../../../Props/ChatElementProps';
import ChatBalloon from '../../Atoms/ChatBalloon';
import { useChat } from '../../../Hooks/useChat';

export default function ChatElement({ message, name }: ChatElementProps) {
  const [chat] = useChat();
  const speaker = chat.chatMembers.find((m) => m.name === name);
  const self = speaker?.name === '엄준식은살아있다';

  return (
    <HStack
      alignItems="flex-end"
      alignSelf={self ? 'flex-end' : 'flex-start'}
      justifyContent={self ? 'flex-end' : 'flex-start'}
      w="80%"
    >
      {!self && (
        <Box alignItems="flex-end">
          {speaker?.profileIcon && (
            <Image
              src={speaker?.profileIcon}
              borderRadius="full"
              boxSize="2em"
            />
          )}
          {!speaker?.profileIcon && <Box boxSize="2em" />}
        </Box>
      )}
      <VStack alignItems="flex-start">
        {!self && (
          <Box w="full">
            <Text textAlign="left" fontSize="sm" m={0} textColor="gray.500">
              {speaker?.name}
            </Text>
          </Box>
        )}
        <Box my="0!important">
          <ChatBalloon self={self}>{message}</ChatBalloon>
        </Box>
      </VStack>
    </HStack>
  );
}

ChatElement.defaultProps = {
  speaker: undefined,
};
