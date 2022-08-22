import { HStack, VStack, Text } from '@chakra-ui/react';
import React from 'react';
import { useChat } from '../../../Hooks/useChat';
import ScrollableVStack from '../../Atoms/ScrollableVStack';
import ChatMemberElement from '../../Molecules/ChatMemberElement';
import ChatModalContext from '../ChatModal/ChatModalContext';
import UserContextMenu from '../../Templates/UserContextMenu';

export default function ChatMembers() {
  const [chat] = useChat();
  const ref = React.useContext(ChatModalContext);
  return (
    <VStack>
      <HStack w="full" justifyContent="space-between">
        <Text fontSize="sm">채팅방인원</Text>
        <Text fontSize="sm">{chat.chatMembers.length}</Text>
      </HStack>
      <ScrollableVStack h="70vh" w="full" paddingRight="0.5em">
        {chat.chatMembers.map((member) => (
          <UserContextMenu
            env={ref?.current ?? document}
            key={member.name}
            target={member.userId}
            targetName={member.name}
            mode={chat.chatInfo.roomType === 'PRIVATE' ? 'friend' : 'chat'}
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
