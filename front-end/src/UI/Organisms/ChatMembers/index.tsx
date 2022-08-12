import { HStack, VStack, Text } from '@chakra-ui/react';
import React from 'react';
import { useChat } from '../../../Hooks/useChat';
import ScrollableVStack from '../../Atoms/ScrollableVStack';
import ChatMemberElement from '../../Molecules/ChatMemberElement';
import UserContextMenu from '../../Templates/UserContextMenu';

export default function ChatMembers() {
  const [chat] = useChat();
  return (
    <VStack>
      <HStack w="full" justifyContent="space-between">
        <Text fontSize="sm">채팅방인원</Text>
        <Text fontSize="sm">
          {chat.chatMembers.length}/{chat.chatInfo.maxHeadCount}
        </Text>
      </HStack>
      <ScrollableVStack h="70vh" w="full" paddingRight="0.5em">
        {chat.chatMembers.map((member) => (
          <UserContextMenu
            key={member.name}
            target={member.userId}
            targetName={member.name}
            mode={chat.chatInfo.roomType === 'private' ? 'friend' : 'chat'}
            eventType="contextmenu"
          >
            <ChatMemberElement
              userId={member.userId}
              profileImg={member.profileImg}
              name={member.name}
              role={member.role}
              muted={member.muted}
              blocked={member.blocked}
            />
          </UserContextMenu>
        ))}
      </ScrollableVStack>
    </VStack>
  );
}
