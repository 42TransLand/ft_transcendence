import { HStack, VStack, Text } from '@chakra-ui/react';
import React from 'react';
import { useChat } from '../../../Hooks/useChat';
import ScrollableVStack from '../../Atoms/ScrollableVStack';
import ChatMemberElement from '../../Molecules/ChatMemberElement';
import ChatModalContext from '../ChatModal/ChatModalContext';
import UserContextMenu from '../../Templates/UserContextMenu';
import useMe from '../../../Hooks/useMe';

export default function ChatMembers() {
  const [chat] = useChat();
  const ref = React.useContext(ChatModalContext);
  const { nickname: myName } = useMe();
  const me =
    chat.chatMembers[
      chat.chatMembers.findIndex((member) => member.name === myName)
    ];
  return (
    <VStack>
      <HStack w="full" justifyContent="space-between">
        <Text fontSize="sm">채팅방인원</Text>
        <Text fontSize="sm">{chat.chatMembers.length}</Text>
      </HStack>
      <ScrollableVStack h="70vh" w="full" paddingRight="0.5em">
        {chat.chatMembers.map((member) =>
          member.name === myName ? (
            <ChatMemberElement
              key={member.userId}
              userId={member.userId}
              profileImg={member.profileImg}
              name={member.name}
              role={member.role}
              muted={member.muted}
              blocked={member.blocked}
            />
          ) : (
            <UserContextMenu
              env={ref?.current ?? document}
              userId={member.userId}
              name={member.name}
              muted={member.muted}
              role={member.role}
              key={member.name}
              mode={chat.chatInfo.roomType === 'PRIVATE' ? 'friend' : 'chat'}
              me={me}
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
          ),
        )}
      </ScrollableVStack>
    </VStack>
  );
}
