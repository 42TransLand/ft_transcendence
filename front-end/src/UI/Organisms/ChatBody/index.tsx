import React from 'react';
import ScrollableVStack from '../../Atoms/ScrollableVStack';
import ChatElement from '../../Molecules/ChatElement';
import Sidebar from '../../Templates/Sidebar';
import ChatHeader from '../ChatHeader';
import ChatMembers from '../ChatMembers';
import { useChat } from '../../../Hooks/useChat';

export default function ChatBody() {
  const [chat, dispatch] = useChat();
  const chatViewRef = React.useRef<HTMLElement>(null);
  const scrollBottom = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = React.useCallback((force: boolean) => {
    let shouldScrollDown = force;
    const chatView = chatViewRef.current;
    if (chatView) {
      if (
        chatView.scrollHeight - chatView.scrollTop - chatView.clientHeight <
        100
      )
        shouldScrollDown = true;
    }
    if (shouldScrollDown)
      scrollBottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  React.useEffect(() => {
    scrollToBottom(true);
    dispatch({ action: 'registerChatScroller', scrollToBottom });
  }, [dispatch, scrollToBottom]);

  return (
    <Sidebar header={<ChatHeader />} sidebar={<ChatMembers />}>
      <ScrollableVStack ref={chatViewRef} h="70vh" paddingRight="0.5em">
        {chat.chats.map((c) => (
          <ChatElement key={c.id} name={c.name} message={c.message} id={c.id} />
        ))}
        <div ref={scrollBottom} />
      </ScrollableVStack>
    </Sidebar>
  );
}
