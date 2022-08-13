import React from 'react';
import ScrollableVStack from '../../Atoms/ScrollableVStack';
import ChatElement from '../../Molecules/ChatElement';
import Sidebar from '../../Templates/Sidebar';
import ChatHeader from '../ChatHeader';
import ChatMembers from '../ChatMembers';
import { useChat } from '../../../Hooks/useChat';

export default function ChatBody() {
  const [chat] = useChat();
  const chatViewRef = React.useRef<HTMLElement>(null);
  const scrollToBottom = (): void => {
    if (chatViewRef.current) {
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chat.chats]);

  return (
    <Sidebar header={<ChatHeader />} sidebar={<ChatMembers />}>
      <ScrollableVStack ref={chatViewRef} h="70vh" paddingRight="0.5em">
        {chat.chats.map((c) => (
          <ChatElement key={c.id} name={c.name} message={c.message} id={c.id} />
        ))}
      </ScrollableVStack>
    </Sidebar>
  );
}
